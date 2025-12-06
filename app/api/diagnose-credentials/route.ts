import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('🔍 Checking user_credentials table with raw SQL...');
    console.log('📍 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Has service key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Try multiple approaches
    
    // Approach 1: Normal query
    const { data: data1, error: error1 } = await supabaseAdmin
      .from('user_credentials')
      .select('*');
    
    console.log('Approach 1 (normal):', { count: data1?.length, error: error1?.message });
    
    // Approach 2: With schema specified
    const { data: data2, error: error2 } = await supabaseAdmin
      .schema('public')
      .from('user_credentials')
      .select('*');
    
    console.log('Approach 2 (with schema):', { count: data2?.length, error: error2?.message });
    
    // Approach 3: Raw SQL via RPC
    const { data: data3, error: error3 } = await supabaseAdmin
      .rpc('exec_sql', { sql_query: 'SELECT * FROM public.user_credentials' })
      .catch(() => ({ data: null, error: { message: 'RPC not available' } }));
    
    console.log('Approach 3 (RPC):', { data: data3, error: error3?.message });
    
    return NextResponse.json({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      approach1: {
        count: data1?.length || 0,
        data: data1,
        error: error1?.message
      },
      approach2: {
        count: data2?.length || 0,
        data: data2,
        error: error2?.message
      },
      approach3: {
        data: data3,
        error: error3?.message
      }
    });
    
  } catch (error: any) {
    console.error('💥 Error:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
