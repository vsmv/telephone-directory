import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔍 Testing Supabase Connection...');
    console.log('URL:', url);
    console.log('Has anon key:', !!anonKey);
    console.log('Has service key:', !!serviceKey);
    
    if (!url || !serviceKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing configuration',
        hasUrl: !!url,
        hasAnonKey: !!anonKey,
        hasServiceKey: !!serviceKey
      }, { status: 500 });
    }
    
    // Create client with service role
    const supabase = createClient(url, serviceKey);
    
    // Test 1: Simple query to a known table
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('count');
    
    // Test 2: Query user_credentials
    const { data: creds, error: credsError } = await supabase
      .from('user_credentials')
      .select('*');
    
    // Test 3: List all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    return NextResponse.json({
      success: true,
      connection: {
        url,
        hasAnonKey: !!anonKey,
        hasServiceKey: !!serviceKey
      },
      tests: {
        contacts: {
          success: !contactsError,
          count: contacts?.length,
          error: contactsError?.message
        },
        user_credentials: {
          success: !credsError,
          count: creds?.length,
          data: creds,
          error: credsError?.message
        },
        tables: {
          success: !tablesError,
          tableNames: tables?.map(t => t.table_name),
          error: tablesError?.message
        }
      }
    });
    
  } catch (error: any) {
    console.error('💥 Connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
