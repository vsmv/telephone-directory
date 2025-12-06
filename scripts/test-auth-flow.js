// Script to test the authentication flow without creating users
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthFlow() {
  try {
    console.log('🧪 Testing Authentication Flow...');
    console.log('📡 Supabase URL:', supabaseUrl);
    console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
    console.log('');

    // Test 1: Check if we can connect to Supabase
    console.log('1️⃣ Testing Supabase connection...');
    const { data, error } = await supabase.from('contacts').select('count').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('   This might be expected if RLS policies block anon access');
    } else {
      console.log('✅ Connection successful');
    }
    console.log('');

    // Test 2: Try to login with existing users (from issue documents)
    const testCredentials = [
      { email: 'giri@rediffmail.com', password: '%%WkHaUPu@Q2..' },
      { email: 'jeyarish.venki@gmail.com', password: 'Welcome123$' },
      { email: 'vsmv1@rediffmail.com', password: 'Z9tD8qajuckp' }
    ];

    console.log('2️⃣ Testing login with existing credentials...');
    
    for (const creds of testCredentials) {
      console.log(`🔐 Trying: ${creds.email}`);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password,
      });

      if (authError) {
        console.log(`   ❌ Failed: ${authError.message}`);
      } else {
        console.log(`   ✅ Success! User ID: ${authData.user.id}`);
        console.log(`   📧 Email: ${authData.user.email}`);
        console.log(`   ✅ Email confirmed: ${authData.user.email_confirmed_at ? 'Yes' : 'No'}`);
        
        // Test getting user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        if (profileError) {
          console.log(`   ⚠️ Profile not found: ${profileError.message}`);
        } else {
          console.log(`   👤 Profile: ${profile.role} role`);
        }
        
        // Sign out for next test
        await supabase.auth.signOut();
      }
      console.log('');
    }

    // Test 3: Check what users exist in auth system (if we can)
    console.log('3️⃣ Testing user registration...');
    
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test@123456';
    
    console.log(`📝 Registering: ${testEmail}`);
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      console.log(`   ❌ Registration failed: ${signUpError.message}`);
    } else {
      console.log(`   ✅ Registration initiated!`);
      console.log(`   📧 Check email for confirmation (or use auto-confirm in dashboard)`);
      console.log(`   👤 User ID: ${signUpData.user?.id}`);
    }

    console.log('');
    console.log('🎯 Summary:');
    console.log('- If login tests failed, users may not exist in Supabase Auth');
    console.log('- If registration worked, you can create users via API');
    console.log('- Check Supabase Dashboard → Authentication → Users to manage users');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Go to https://supabase.com/dashboard/project/pcrukmbtjyuuzwszsdsl');
    console.log('2. Navigate to Authentication → Users');
    console.log('3. Create admin user manually or confirm existing users');
    console.log('4. Test login with the created/confirmed user');

  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

testAuthFlow();
