const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsers() {
  try {
    console.log('🔍 Checking existing users...');
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }
    
    console.log('✅ Found users:', users.users.length);
    users.users.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id})`);
    });
    
    // Check user_profiles table
    console.log('\n📋 Checking user_profiles...');
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*');
      
    if (profileError) {
      console.error('❌ Profile error:', profileError.message);
    } else {
      console.log('✅ Found profiles:', profiles.length);
      profiles.forEach(profile => {
        console.log(`   - ${profile.email} (Role: ${profile.role})`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

checkUsers();
