import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Checking Supabase Auth Users...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Check if service role key is configured
    if (!supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY not configured',
        message: 'Service role key is required for admin operations',
        hasUrl: !!supabaseUrl,
        hasServiceKey: false
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey);
    
    // List all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error listing auth users:', authError);
      return NextResponse.json({
        success: false,
        error: 'Failed to list auth users',
        details: authError.message
      }, { status: 500 });
    }
    
    // Get user profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');
    
    // Get user credentials (if exists)
    const { data: credentials, error: credError } = await supabase
      .from('user_credentials')
      .select('email');
    
    console.log('✅ Auth Users:', authUsers?.users?.length || 0);
    console.log('✅ User Profiles:', profiles?.length || 0);
    console.log('✅ User Credentials:', credentials?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: 'User data retrieved successfully',
      environment: {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        url: supabaseUrl
      },
      authUsers: {
        count: authUsers?.users?.length || 0,
        users: authUsers?.users?.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at
        })) || []
      },
      profiles: {
        count: profiles?.length || 0,
        data: profiles || []
      },
      credentials: {
        count: credentials?.length || 0,
        emails: credentials?.map(c => c.email) || []
      },
      errors: {
        auth: authError?.message || null,
        profiles: profileError?.message || null,
        credentials: credError?.message || null
      }
    });
    
  } catch (error: any) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error.message
    }, { status: 500 });
  }
}
