import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Secret for JWT signing (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { email, password } = body;

    // Normalize email to lowercase for case-insensitive matching
    if (email) {
      email = email.toLowerCase().trim();
    }

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

    // Check demo user credentials (for testing only)
    if (email === 'user@actrec.gov.in' && password === 'user123') {
      console.log('✅ Demo user login');
      const token = await new SignJWT({ id: 'demo-user-1', email: 'user@actrec.gov.in', role: 'regular' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
      
      return NextResponse.json({
        user: {
          id: 'demo-user-1',
          email: 'user@actrec.gov.in',
          role: 'regular'
        },
        token
      });
    }

    // Check for admin demo user
    if (email === 'jeyarish.venki@gmail.com' && password === 'Welcome123$') {
      console.log('✅ Admin demo user login');
      const token = await new SignJWT({ id: 'admin-demo-1', email: 'jeyarish.venki@gmail.com', role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
      
      return NextResponse.json({
        user: {
          id: 'admin-demo-1',
          email: 'jeyarish.venki@gmail.com',
          role: 'admin'
        },
        token
      });
    }

    // Check database credentials
    console.log('🔍 Checking database for:', email);
    console.log('📝 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Has service role key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: credentials, error: credError } = await supabase
      .from('user_credentials')
      .select('email, password')
      .eq('email', email)
      .single();

    if (credError || !credentials) {
      console.log('❌ Credentials not found:', credError?.message, credError?.code);
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
    
    // Generate JWT token
    const token = await new SignJWT({ id: profile.id, email: profile.email, role: profile.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
