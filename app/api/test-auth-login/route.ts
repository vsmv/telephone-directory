import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log('🧪 Testing Supabase Auth with:', { email, passwordLength: password?.length });
    
    // Test 1: Check if service role key is configured
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log('🔑 Service role key configured:', hasServiceKey);
    
    if (!hasServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Service role key not configured',
        step: 'configuration'
      });
    }
    
    // Test 2: Try to authenticate
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('🔐 Auth result:', {
      success: !authError,
      error: authError?.message,
      userId: authData?.user?.id
    });
    
    if (authError) {
      // Test 3: Check if user exists
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      const userExists = users?.users?.some(u => u.email === email);
      
      return NextResponse.json({
        success: false,
        error: authError.message,
        step: 'authentication',
        details: {
          userExists,
          totalUsers: users?.users?.length || 0,
          errorCode: authError.status,
          errorName: authError.name
        }
      });
    }
    
    // Test 4: Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    return NextResponse.json({
      success: true,
      message: 'Authentication successful!',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        created_at: authData.user.created_at
      },
      profile: profile || null,
      profileError: profileError?.message || null
    });
    
  } catch (error: any) {
    console.error('💥 Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      step: 'exception'
    }, { status: 500 });
  }
}
