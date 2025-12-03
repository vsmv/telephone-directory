const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixPhoneNumber() {
  console.log('\n🔧 Making phone_number column optional\n');
  
  // Try to make phone_number nullable using raw SQL
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE contacts ALTER COLUMN phone_number DROP NOT NULL;'
  }).catch(async () => {
    // If RPC doesn't exist, try direct query
    console.log('⚠️ exec_sql RPC not available, trying direct approach...\n');
    
    // Alternative: Update schema via Supabase client
    console.log('📋 MANUAL FIX REQUIRED:');
    console.log('');
    console.log('Go to Supabase Dashboard → SQL Editor and run:');
    console.log('');
    console.log('ALTER TABLE contacts ALTER COLUMN phone_number DROP NOT NULL;');
    console.log('');
    console.log('This will allow phone_number to be optional.');
    console.log('');
    
    return { data: null, error: 'RPC not available' };
  });
  
  if (error) {
    if (error === 'RPC not available') {
      // Already showed manual instructions above
    } else {
      console.log('❌ Error:', error.message || error);
      console.log('\n📋 Run this SQL manually in Supabase Dashboard:');
      console.log('ALTER TABLE contacts ALTER COLUMN phone_number DROP NOT NULL;');
    }
  } else {
    console.log('✅ Success! phone_number column is now optional');
    console.log('\n✓ You can now bulk upload contacts without phone numbers');
  }
  
  console.log('\n' + '='.repeat(60));
}

fixPhoneNumber().catch(console.error);
