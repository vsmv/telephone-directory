import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('🔧 Seeding user_credentials table...');
    
    const credentials = [
      { email: 'giri@rediffmail.com', password: '%%WkHaUPu@Q2' },
      { email: 'vsmv1@rediffmail.com', password: 'Z9tD8qajuckp' },
      { email: 'jeyarish.venki@gmail.com', password: 'Welcome123$' }
    ];
    
    const { data, error } = await supabaseAdmin
      .from('user_credentials')
      .upsert(credentials, { onConflict: 'email' })
      .select();
    
    if (error) {
      console.error('❌ Error seeding:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 });
    }
    
    console.log('✅ Seeded', data?.length, 'credentials');
    
    // Verify
    const { data: allCreds } = await supabaseAdmin
      .from('user_credentials')
      .select('*');
    
    return NextResponse.json({
      success: true,
      message: 'User credentials seeded successfully',
      inserted: data?.length || 0,
      total: allCreds?.length || 0,
      credentials: allCreds
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
