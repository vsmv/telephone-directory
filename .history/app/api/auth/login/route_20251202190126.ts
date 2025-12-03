import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 LOGIN ATTEMPT - RAW BODY:', JSON.stringify(body));
    console.log('🔐 LOGIN ATTEMPT:', { 
      email, 
      emailType: typeof email,
      emailLength: email?.length,
      password: password?.substring(0, 3) + '***',
      passwordLength: password?.length,
      passwordType: typeof password
    });

    if (!email || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check demo credentials first
    if (email === 'admin@actrec.gov.in' && password === 'admin123') {
      console.log('✅ Demo admin login');
      return NextResponse.json({
        user: {
          id: 'demo-admin-1',
          email: 'admin@actrec.gov.in',
          role: 'admin'
        }
      });
    }

    if (email === 'user@actrec.gov.in' && password === 'user123') {
      console.log('✅ Demo user login');
      return NextResponse.json({
        user: {
          id: 'demo-user-1',
          email: 'user@actrec.gov.in',
          role: 'regular'
        }
      });
    }

    // Check database credentials
    console.log('🔍 Checking database for:', email);
    const { data: credentials, error: credError } = await supabase
      .from('user_credentials')
      .select('email, password')
      .eq('email', email)
      .single();

    if (credError || !credentials) {
      console.log('❌ Credentials not found:', credError?.message);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('✅ Credentials found for:', credentials.email);

    // Check password match
    console.log('🔑 Password check:', { 
      provided: password.substring(0, 3) + '***',
      stored: credentials.password?.substring(0, 3) + '***',
      match: credentials.password === password 
    });
    
    if (credentials.password !== password) {
      console.log('❌ Password mismatch');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get user profile for role information
    console.log('👤 Fetching user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      console.log('❌ Profile not found:', profileError?.message);
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    console.log('✅ LOGIN SUCCESS:', { email: profile.email, role: profile.role });
    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
