const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyUser() {
  console.log('\n🔍 CHECKING USER: jeyarish.venki@gmail.com\n');
  
  // Check user_profiles
  console.log('1️⃣ Checking user_profiles table...');
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', 'jeyarish.venki@gmail.com')
    .single();
  
  if (profileError) {
    console.log('   ❌ User profile NOT found:', profileError.message);
  } else {
    console.log('   ✅ User profile found:');
    console.log('      ID:', profile.id);
    console.log('      Email:', profile.email);
    console.log('      Role:', profile.role);
  }
  
  // Check user_credentials
  console.log('\n2️⃣ Checking user_credentials table...');
  const { data: creds, error: credsError } = await supabase
    .from('user_credentials')
    .select('*')
    .eq('email', 'jeyarish.venki@gmail.com')
    .single();
  
  if (credsError) {
    console.log('   ❌ User credentials NOT found:', credsError.message);
  } else {
    console.log('   ✅ User credentials found:');
    console.log('      Email:', creds.email);
    console.log('      Password Hash:', creds.password_hash);
  }
  
  // Check table structure
  console.log('\n3️⃣ Checking user_credentials table structure...');
  const { data: columns, error: colError } = await supabase
    .rpc('exec_sql', { 
      sql: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_credentials' ORDER BY ordinal_position;` 
    })
    .catch(async () => {
      // Fallback: try to get data to see column names
      const { data: sample, error } = await supabase
        .from('user_credentials')
        .select('*')
        .limit(1);
      
      if (sample && sample.length > 0) {
        console.log('   ✅ Available columns:', Object.keys(sample[0]).join(', '));
        return { data: sample, error: null };
      }
      return { data: null, error };
    });
  
  console.log('\n4️⃣ Listing all users in user_profiles...');
  const { data: allProfiles, error: allError } = await supabase
    .from('user_profiles')
    .select('email, role')
    .order('email');
  
  if (allError) {
    console.log('   ❌ Error:', allError.message);
  } else {
    console.log(`   ✅ Found ${allProfiles.length} users:`);
    allProfiles.forEach(p => console.log(`      - ${p.email} (${p.role})`));
  }
  
  console.log('\n5️⃣ Listing all credentials in user_credentials...');
  const { data: allCreds, error: allCredsError } = await supabase
    .from('user_credentials')
    .select('email')
    .order('email');
  
  if (allCredsError) {
    console.log('   ❌ Error:', allCredsError.message);
  } else {
    console.log(`   ✅ Found ${allCreds.length} credential records:`);
    allCreds.forEach(c => console.log(`      - ${c.email}`));
  }
  
  console.log('\n' + '='.repeat(60));
}

verifyUser().catch(console.error);
