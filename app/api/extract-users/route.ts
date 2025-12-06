import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Querying Supabase Auth users and profiles...');
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Query 1: List all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    // Query 2: List all user profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('✅ Auth users:', authUsers?.users?.length || 0);
    console.log('✅ Profiles:', profiles?.length || 0);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      authUsers: {
        count: authUsers?.users?.length || 0,
        users: authUsers?.users?.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          confirmed_at: u.confirmed_at,
          phone: u.phone
        })) || [],
        error: authError?.message || null
      },
      profiles: {
        count: profiles?.length || 0,
        data: profiles?.map(p => ({
          id: p.id,
          email: p.email,
          role: p.role,
          created_at: p.created_at
        })) || [],
        error: profilesError?.message || null
      }
    });
    
  } catch (error: any) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
