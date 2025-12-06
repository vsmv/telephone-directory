import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Listing Supabase Auth users...');
    console.log('📍 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Has service key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // List all users
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error listing users:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }, { status: 500 });
    }
    
    console.log('✅ Found', data.users.length, 'users');
    
    return NextResponse.json({
      success: true,
      totalUsers: data.users.length,
      users: data.users.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        confirmed_at: u.confirmed_at
      }))
    });
    
  } catch (error: any) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
