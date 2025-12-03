import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

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

// Secret for JWT verification (must match login route)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Helper to get user from JWT token
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as 'admin' | 'regular'
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Helper to authorize updates for regular users and validate update payload
function authorizeUpdateForUser(user: any, existingContact: any, updates: any) {
  if (!user) {
    return { status: 401, message: 'Unauthorized' };
  }

  if (user.role === 'regular') {
    if (!existingContact) {
      return { status: 404, message: 'Contact not found' };
    }

    if (existingContact.email !== user.email) {
      return { status: 403, message: 'Forbidden: You can only edit your own contact information' };
    }

    if (updates.name || updates.extension || updates.email) {
      return { status: 403, message: 'Forbidden: You cannot change your name, extension, or email. Contact admin for changes.' };
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only admins may create contacts via API
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const body = await request.json();
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(body)
      .select()
      .single();

    if (error) {
      // Parse duplicate key error to provide user-friendly message
      let errorMessage = error.message;
      
      if (error.message.includes('duplicate key') || error.code === '23505') {
        if (error.message.includes('contacts_extension_key')) {
          errorMessage = 'A contact with this extension number already exists. Please use a different extension.';
        } else if (error.message.includes('contacts_email_key')) {
          errorMessage = 'A contact with this email address already exists. Please use a different email.';
        } else if (error.message.includes('contacts_phone_number_key')) {
          errorMessage = 'A contact with this phone number already exists. Please use a different phone number.';
        } else {
          errorMessage = 'A contact with duplicate information already exists. Please check extension, email, or phone number.';
        }
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get the contact being updated
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('email')
      .eq('id', id)
      .single();

    // Authorization and validation for updates
    const authError = authorizeUpdateForUser(user, existingContact, updates);
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status });
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only admins can delete contacts
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Get the contact being deleted
    const { data: contact } = await supabase
      .from('contacts')
      .select('email')
      .eq('id', id)
      .single();

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Check if this contact email belongs to an admin user
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('email', contact.email)
      .single();

    if (userProfile && userProfile.role === 'admin') {
      // Check if this is the last admin
      const { data: allAdmins, error: adminError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin');

      if (adminError) {
        console.error('Error checking admin count:', adminError);
        return NextResponse.json({ error: 'Failed to verify admin status' }, { status: 500 });
      }

      if (allAdmins && allAdmins.length <= 1) {
        return NextResponse.json({ 
          error: 'Cannot delete the last administrator contact. The system must have at least one admin.' 
        }, { status: 403 });
      }

      return NextResponse.json({ 
        error: 'Cannot delete administrator contact. Admin contacts are protected to maintain system security.' 
      }, { status: 403 });
    }

    // If not an admin contact, proceed with deletion
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}