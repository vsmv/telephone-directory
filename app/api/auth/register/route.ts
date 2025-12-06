import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for authentication
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create Supabase admin client for database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { email, password, role = 'regular' } = body;

    console.log('🔐 SUPABASE AUTH REGISTER ATTEMPT:', { email, role, passwordLength: password?.length });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    email = email.toLowerCase().trim();

    // Validate role
    if (!['admin', 'regular'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or regular' },
        { status: 400 }
      );
    }

    // Check if user already exists in Supabase Auth
    console.log('🔍 Checking if user exists in Supabase Auth...');
    
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.log('⚠️ Could not check existing users:', listError.message);
    } else {
      const existingUser = existingUsers.users.find(user => user.email === email);
      if (existingUser) {
        console.log('❌ User already exists in Supabase Auth');
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Sign up user in Supabase Auth
    console.log('👤 Creating user in Supabase Auth...');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    console.log('🔍 Supabase Auth result:', { 
      hasUser: !!authData.user, 
      hasError: !!authError,
      errorMessage: authError?.message,
      userEmail: authData.user?.email 
    });

    if (authError || !authData.user) {
      console.log('❌ Supabase Auth signup failed:', authError?.message);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user' },
        { status: 400 }
      );
    }

    console.log('✅ Supabase Auth successful, creating profile...');

    // Create user profile in user_profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        role
      })
      .select()
      .single();

    if (profileError || !profile) {
      console.log('❌ Failed to create profile:', profileError?.message);
      // Try to clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    console.log('✅ REGISTRATION SUCCESS:', { email: profile.email, role: profile.role });

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role
      },
      message: 'User registered successfully. Please check your email to verify your account.'
    });

  } catch (error: any) {
    console.error('💥 Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
