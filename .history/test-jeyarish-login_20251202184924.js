const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testLogin() {
  const email = 'jeyarish.venki@gmail.com';
  const password = '3nt&irZtWr5Y';
  
  console.log('\n🔐 TESTING LOGIN FLOW\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);
  
  // Step 1: Check credentials
  console.log('1️⃣ Checking credentials table...');
  const { data: credentials, error: credError } = await supabase
    .from('user_credentials')
    .select('email, password')
    .eq('email', email)
    .single();
  
  if (credError) {
    console.log('   ❌ Error fetching credentials:', credError.message);
    console.log('   Full error:', JSON.stringify(credError, null, 2));
  } else {
    console.log('   ✅ Credentials found:');
    console.log('      Email:', credentials.email);
    console.log('      Password in DB:', credentials.password);
    console.log('      Password matches:', credentials.password === password);
  }
  
  // Step 2: Check user profile
  console.log('\n2️⃣ Checking user profile...');
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, email, role')
    .eq('email', email)
    .single();
  
  if (profileError) {
    console.log('   ❌ Error fetching profile:', profileError.message);
  } else {
    console.log('   ✅ Profile found:');
    console.log('      ID:', profile.id);
    console.log('      Email:', profile.email);
    console.log('      Role:', profile.role);
  }
  
  // Step 3: Simulate the login API logic
  console.log('\n3️⃣ Simulating login API logic...');
  
  if (credError || !credentials) {
    console.log('   ❌ Would return: Invalid email or password (credentials not found)');
  } else if (credentials.password !== password) {
    console.log('   ❌ Would return: Invalid email or password (password mismatch)');
    console.log('      Expected:', password);
    console.log('      Got:', credentials.password);
  } else if (profileError || !profile) {
    console.log('   ❌ Would return: User profile not found');
  } else {
    console.log('   ✅ Would return SUCCESS:');
    console.log('      User ID:', profile.id);
    console.log('      Email:', profile.email);
    console.log('      Role:', profile.role);
  }
  
  console.log('\n' + '='.repeat(60));
}

testLogin().catch(console.error);
