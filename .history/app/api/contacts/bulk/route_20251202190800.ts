import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper to get user from session (expects Authorization: Bearer <token>)
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: userData } = await supabase
    .from('user_profiles')
    .select('email, role')
    .eq('id', user.id)
    .single();

  return userData;
}

// Helper to delete a contact and its user profile
async function processDeleteId(id: string) {
  try {
    const { data: contact } = await supabase
      .from('contacts')
      .select('id, email, name')
      .eq('id', id)
      .single();

    if (!contact) return { id, error: 'Contact not found' };

    const { error: profileDeleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (profileDeleteError) {
      console.warn(`Failed to delete user profile for contact ${id}:`, profileDeleteError.message);
    }

    const { error: contactDeleteError } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (contactDeleteError) return { id, error: `Contact deletion failed: ${contactDeleteError.message}` };

    return { id, deleted: contact };
  } catch (err: any) {
    return { id, error: `Unexpected error: ${err.message}` };
  }
}

// Helper to insert a contact and create user profile and credentials
async function processInsertContact(contact: any) {
  // Check duplicates
  const { data: emailExistsContacts } = await supabase
    .from('contacts')
    .select('id, name')
    .eq('email', contact.email)
    .limit(1);

  const { data: emailExistsProfiles } = await supabase
    .from('user_profiles')
    .select('id, email')
    .eq('email', contact.email)
    .limit(1);

  const { data: extensionExists } = await supabase
    .from('contacts')
    .select('id, name')
    .eq('extension', contact.extension)
    .limit(1);

  if (emailExistsContacts && emailExistsContacts.length > 0) {
    return { skipped: true, reason: `Email ${contact.email} is already used by ${emailExistsContacts[0].name} in contacts` };
  }
  if (emailExistsProfiles && emailExistsProfiles.length > 0) {
    return { skipped: true, reason: `Email ${contact.email} is already registered as user` };
  }
  if (extensionExists && extensionExists.length > 0) {
    return { skipped: true, reason: `Extension ${contact.extension} is already used by ${extensionExists[0].name}` };
  }

  const password = Math.random().toString(36).slice(-12) + 'A1!';

  try {
    const { data: newContact, error: contactError } = await supabase
      .from('contacts')
      .insert([{ ...contact, institution: contact.institution || 'ACTREC' }])
      .select()
      .single();

    if (contactError) return { skipped: true, reason: `Contact creation failed: ${contactError.message}` };

    if (newContact) {
      const hashedPassword = await bcrypt.hash(password, 12);

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{ id: newContact.id, email: contact.email, role: 'regular' }]);

      if (profileError) {
        await supabase.from('contacts').delete().eq('id', newContact.id);
        return { skipped: true, reason: `User profile creation failed: ${profileError.message}` };
      }

      return { inserted: { ...newContact, generatedPassword: password }, credential: { email: contact.email, password, name: contact.name, id: newContact.id } };
    }
  } catch (err) {
    return { skipped: true, reason: 'Unexpected error during creation' };
  }
}

function aggregateDeleteResults(results: any[]) {
  const deletedContacts: any[] = [];
  const errors: any[] = [];
  for (const r of results) {
    if (r.deleted) deletedContacts.push(r.deleted);
    if (r.error) errors.push({ id: r.id, error: r.error });
  }
  return { deletedContacts, errors };
}

function aggregateInsertResults(results: any[]) {
  const inserted: any[] = [];
  const skipped: any[] = [];
  const createdCredentials: any[] = [];

  for (const r of results) {
    if (r.inserted) {
      inserted.push(r.inserted);
      if (r.credential) createdCredentials.push(r.credential);
    } else if (r.skipped) {
      skipped.push({ reason: r.reason });
    }
  }

  return { inserted, skipped, createdCredentials };
}

// Bulk update multiple contacts
export async function PUT(request: NextRequest) {
  try {
    // Require admin to perform bulk updates
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const body = await request.json();
    const { ids, updates } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Updates object is required' }, { status: 400 });
    }

    // Start transaction for contacts and user_profiles updates
    const updatedContacts: any[] = [];
    const errors: any[] = [];

    for (const id of ids) {
      try {
        // Update contact
        const { data: contact, error: contactError } = await supabase
          .from('contacts')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (contactError) {
          errors.push({ id, error: `Contact update failed: ${contactError.message}` });
          continue;
        }

        // If email is being updated, sync with user_profiles
        if (updates.email) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              email: updates.email,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (profileError) {
            console.warn(`Failed to sync email update for user ${id}:`, profileError.message);
          }
        }

        updatedContacts.push(contact);
      } catch (error: any) {
        errors.push({ id, error: `Update failed: ${error.message}` });
      }
    }

    return NextResponse.json({
      data: updatedContacts,
      errors,
      summary: {
        total: ids.length,
        updated: updatedContacts.length,
        errors: errors.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bulk delete multiple contacts with CASCADE to user_profiles
export async function DELETE(request: NextRequest) {
  try {
    // Require admin to perform bulk deletes
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 });
    }

    // Delete contacts in parallel and aggregate results
    const results = await Promise.all(ids.map((id: string) => processDeleteId(id)));
    const { deletedContacts, errors } = aggregateDeleteResults(results);

    return NextResponse.json({
      success: true,
      deleted: deletedContacts,
      errors,
      summary: {
        total: ids.length,
        deleted: deletedContacts.length,
        errors: errors.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bulk insert multiple contacts with user profile creation
export async function POST(request: NextRequest) {
  try {
    console.log('📦 BULK INSERT REQUEST received');
    
    // Note: Using service role key bypasses RLS, so this endpoint should be protected
    // In production, add proper authentication middleware
    
    const body = await request.json();
    const { contacts } = body;

    console.log(`📋 Processing ${contacts?.length || 0} contacts for bulk insert`);

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: 'Contacts array is required' }, { status: 400 });
    }

    const inserted: any[] = [];
    const skipped: any[] = [];
    const createdCredentials: any[] = [];

    // Process contacts in parallel and aggregate results
    const results = await Promise.all(contacts.map((c: any) => processInsertContact(c)));
    const aggregated = aggregateInsertResults(results);

    return NextResponse.json({
      data: { inserted: aggregated.inserted, skipped: aggregated.skipped, createdCredentials: aggregated.createdCredentials },
      summary: {
        total: contacts.length,
        inserted: aggregated.inserted.length,
        skipped: aggregated.skipped.length,
        createdCredentials: aggregated.createdCredentials.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Bulk insert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
