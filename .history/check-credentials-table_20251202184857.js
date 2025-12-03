const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable() {
  console.log('\n🔍 CHECKING user_credentials TABLE\n');
  
  // Get all credentials
  const { data, error } = await supabase
    .from('user_credentials')
    .select('*');
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  console.log(`✅ Found ${data.length} credential records\n`);
  
  if (data.length > 0) {
    console.log('📋 Column names in table:');
    console.log('   ', Object.keys(data[0]).join(', '));
    console.log('\n📊 All records:');
    data.forEach((record, i) => {
      console.log(`\n   Record ${i + 1}:`);
      Object.entries(record).forEach(([key, value]) => {
        console.log(`      ${key}: ${value}`);
      });
    });
  }
}

checkTable().catch(console.error);
