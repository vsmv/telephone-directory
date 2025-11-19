
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Function to generate a random password
const generatePassword = () => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 10);
  return nanoid();
};

export async function POST(request: Request) {
  try {
    const contacts = await request.json();

    let successCount = 0;
    const duplicates = [];
    const errors = [];

    for (const contact of contacts) {
      try {
        // Check for duplicate user
        const { data: existingUser, error: existingUserError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', contact.Email);

        if (existingUser && existingUser.length > 0) {
          duplicates.push(`User with email ${contact.Email} already exists.`);
          continue;
        }

        // Create user
        const password = generatePassword();
        const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: contact.Email,
          password: password,
          email_confirm: true, // auto-confirm user
        });

        if (userError) {
          errors.push(`Error creating user for ${contact.Name}: ${userError.message}`);
          continue;
        }

        if (newUser) {
          // Insert contact
          const { error: contactError } = await supabaseAdmin.from('contacts').insert([
            {
              name: contact.Name,
              department: contact.Department,
              designation: contact.Designation,
              phone_number: contact['Phone Number'],
              extension: contact.Extension,
              email: contact.Email,
              location: contact.Location,
              institution: contact.Institution,
            },
          ]);

          if (contactError) {
            errors.push(`Error creating contact for ${contact.Name}: ${contactError.message}`);
            // If contact insertion fails, delete the created user to avoid orphans
            if (newUser.user) {
                await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
            }
          } else {
            successCount++;
          }
        }
      } catch (err: any) {
        errors.push(`${contact.Name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: successCount,
      duplicates,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
