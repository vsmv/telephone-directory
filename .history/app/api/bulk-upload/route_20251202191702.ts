import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';

// Initialize Supabase admin client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Function to generate a random password
const generatePassword = () => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*';
  const nanoid = customAlphabet(alphabet, 12);
  return nanoid() + 'A1!'; // Ensure it meets password requirements
};

export async function POST(request: Request) {
  try {
    console.log('📦 BULK UPLOAD API: Starting upload...');
    const contacts = await request.json();
    console.log(`📋 Processing ${contacts.length} contacts`);

    let successCount = 0;
    const duplicates = [];
    const errors = [];
    const createdCredentials = [];

    for (const contact of contacts) {
      try {
        const contactName = contact.Name || 'Unknown';
        const contactEmail = (contact.Email || '').toLowerCase().trim();
        const contactExtension = contact.Extension || '';
        
        console.log(`🔍 Checking ${contactName} (${contactEmail})...`);

        // Check for duplicate email in contacts table
        const { data: existingContact, error: contactCheckError } = await supabaseAdmin
          .from('contacts')
          .select('id, name')
          .eq('email', contactEmail)
          .limit(1);

        if (existingContact && existingContact.length > 0) {
          console.log(`⚠️ Duplicate: ${contactName} - email already exists`);
          duplicates.push(`${contactName}: Email ${contactEmail} already exists in contacts`);
          continue;
        }

        // Check for duplicate extension
        const { data: existingExtension, error: extCheckError } = await supabaseAdmin
          .from('contacts')
          .select('id, name')
          .eq('extension', contactExtension)
          .limit(1);

        if (existingExtension && existingExtension.length > 0) {
          console.log(`⚠️ Duplicate: ${contactName} - extension already exists`);
          duplicates.push(`${contactName}: Extension ${contactExtension} already used by ${existingExtension[0].name}`);
          continue;
        }

        // Generate password for this user
        const password = generatePassword();
        
        console.log(`➕ Inserting ${contactName} into contacts table...`);
        
        // Insert contact first
        const { data: newContact, error: contactError } = await supabaseAdmin
          .from('contacts')
          .insert([{
            name: contact.Name,
            department: contact.Department || 'Unknown',
            designation: contact.Designation || 'Staff',
            phone_number: contact['Phone Number'] || '',
            extension: contactExtension,
            email: contactEmail,
            location: contact.Location || 'Unknown',
            institution: contact.Institution || 'ACTREC',
          }])
          .select()
          .single();

        if (contactError) {
          console.error(`❌ Failed to insert contact for ${contactName}:`, contactError);
          errors.push(`${contactName}: Contact insert failed - ${contactError.message}`);
          continue;
        }

        console.log(`✅ Contact inserted: ${contactName}, creating user profile...`);

        // Create user profile with the same ID as contact
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert([{
            id: newContact.id,
            email: contactEmail,
            role: 'regular'
          }]);

        if (profileError) {
          console.error(`❌ Failed to create user profile for ${contactName}:`, profileError);
          // Rollback: delete the contact
          await supabaseAdmin.from('contacts').delete().eq('id', newContact.id);
          errors.push(`${contactName}: User profile creation failed - ${profileError.message}`);
          continue;
        }

        console.log(`✅ User profile created, adding credentials...`);

        // Create user credentials
        const { error: credentialsError } = await supabaseAdmin
          .from('user_credentials')
          .insert([{
            email: contactEmail,
            password: password // Store plain text password as per your schema
          }]);

        if (credentialsError) {
          console.error(`❌ Failed to create credentials for ${contactName}:`, credentialsError);
          // Rollback: delete profile and contact
          await supabaseAdmin.from('user_profiles').delete().eq('id', newContact.id);
          await supabaseAdmin.from('contacts').delete().eq('id', newContact.id);
          errors.push(`${contactName}: Credentials creation failed - ${credentialsError.message}`);
          continue;
        }

        console.log(`✅ SUCCESS: ${contactName} fully created`);
        successCount++;
        createdCredentials.push({
          name: contactName,
          email: contactEmail,
          password: password,
          id: newContact.id
        });

      } catch (err: any) {
        console.error(`💥 Unexpected error for ${contact.Name}:`, err);
        errors.push(`${contact.Name}: ${err.message}`);
      }
    }

    console.log(`\n🎉 BULK UPLOAD COMPLETE:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ⚠️ Duplicates: ${duplicates.length}`);
    console.log(`   ❌ Errors: ${errors.length}`);

    return NextResponse.json({
      success: successCount,
      duplicates,
      errors,
      createdCredentials,
      details: {
        inserted: successCount,
        skipped: duplicates.length,
        failed: errors.length
      }
    });
  } catch (error: any) {
    console.error('💥 BULK UPLOAD API ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
