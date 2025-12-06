import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    console.log('🔍 Checking user credentials and profiles...');
    
    // Get all user credentials
    const { data: credentials, error: credError } = await supabase
      .from('user_credentials')
      .select('email, created_at');
    
    // Get all user profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('email, role, created_at');
    
    // Get all contacts (to see if users match contacts)
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('email, name');
    
    console.log('✅ Credentials:', credentials?.length || 0);
    console.log('✅ Profiles:', profiles?.length || 0);
    console.log('✅ Contacts:', contacts?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: 'User data retrieved successfully',
      credentials: {
        count: credentials?.length || 0,
        data: credentials || [],
        error: credError?.message || null
      },
      profiles: {
        count: profiles?.length || 0,
        data: profiles || [],
        error: profileError?.message || null
      },
      contacts: {
        count: contacts?.length || 0,
        emails: contacts?.map(c => c.email) || [],
        error: contactError?.message || null
      },
      loginInstructions: {
        method1: 'Use email from user_credentials table',
        method2: 'Password is stored in password_hash column',
        example: 'If you see admin@actrec.gov.in in credentials, use that email'
      }
    });
    
  } catch (error: any) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
