import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🧪 DIRECT SUPABASE TEST');
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    console.log('Password (first 3 chars):', password?.substring(0, 3));
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Test with anon key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const result = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return NextResponse.json({
      success: !result.error,
      hasUser: !!result.data?.user,
      hasSession: !!result.data?.session,
      error: result.error ? {
        message: result.error.message,
        status: result.error.status,
        code: (result.error as any).code,
        name: result.error.name
      } : null,
      user: result.data?.user ? {
        id: result.data.user.id,
        email: result.data.user.email,
        created_at: result.data.user.created_at,
        email_confirmed_at: result.data.user.email_confirmed_at
      } : null
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
