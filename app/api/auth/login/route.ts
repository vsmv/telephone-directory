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
    let { email, password } = body;

    console.log('🔐 SUPABASE AUTH LOGIN ATTEMPT:', { email, passwordLength: password?.length });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    email = email.toLowerCase().trim();

    // Authenticate using Supabase Auth
    console.log('🔑 Authenticating with Supabase Auth...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('🔍 Supabase Auth result:', { 
      hasUser: !!authData.user, 
      hasError: !!authError,
      errorMessage: authError?.message,
      userEmail: authData.user?.email 
    });

    if (authError || !authData.user) {
      console.log('❌ Supabase Auth failed:', authError?.message);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Supabase Auth successful, fetching profile...');

    // Get user profile from user_profiles table
    let profile;
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      console.log('❌ Profile not found, creating one...');
      
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          role: 'regular' // Default role
        })
        .select()
        .single();

      if (createError || !newProfile) {
        console.log('❌ Failed to create profile:', createError?.message);
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }

      console.log('✅ Profile created successfully');
      profile = newProfile;
    } else {
      profile = profileData;
    }

    console.log('✅ LOGIN SUCCESS:', { email: profile.email, role: profile.role });

    // Return user data and Supabase session
    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role
      },
      session: authData.session,
      token: authData.session?.access_token
    });

  } catch (error: any) {
    console.error('💥 Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
