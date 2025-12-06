const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUser() {
  try {
    console.log('🔧 Creating test user: user@actrec.gov.in');

    const testUser = {
      email: 'user@actrec.gov.in',
      password: 'user123',
      role: 'regular'
    };

    // 1. Create user in Supabase Auth
    console.log('👤 Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️ User already exists, updating password...');
        
        // Get existing user
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === testUser.email);
        
        if (existingUser) {
          // Update password using admin API
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            { password: testUser.password }
          );
          
          if (updateError) {
            console.error('❌ Failed to update password:', updateError.message);
            return;
          }
          
          console.log('✅ Password updated for existing user');
          
          // Update or create profile
          const { data: profile, error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .upsert({
              id: existingUser.id,
              email: existingUser.email,
              role: testUser.role
            })
            .select()
            .single();

          if (profileError) {
            console.error('❌ Failed to update profile:', profileError.message);
            return;
          }

          console.log('✅ Test user ready:', {
            email: testUser.email,
            password: testUser.password,
            role: profile.role
          });
          return;
        }
      }
      
      console.error('❌ Auth error:', authError.message);
      return;
    }

    console.log('✅ Auth user created:', authData.user.email);

    // 2. Create user profile
    console.log('📋 Creating user profile...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        role: testUser.role
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile error:', profileError.message);
      return;
    }

    console.log('✅ Test user created successfully!');
    console.log('📝 Login credentials:');
    console.log('   Email:', testUser.email);
    console.log('   Password:', testUser.password);
    console.log('   Role:', testUser.role);

  } catch (error) {
    console.error('💥 Error creating test user:', error.message);
  }
}

createTestUser();
