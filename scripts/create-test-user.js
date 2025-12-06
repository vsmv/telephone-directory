// Script to create a test admin user for development
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createTestAdmin() {
  try {
    console.log('🔧 Creating test admin user...');

    const testUser = {
      email: 'admin@actrec.gov.in',
      password: 'Admin@123',
      role: 'admin'
    };

    // 1. Create user in Supabase Auth
    console.log('👤 Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true // Auto-confirm for testing
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already registered')) {
        console.log('⚠️ User already exists, trying to get existing user...');
        
        // Get existing user
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === testUser.email);
        
        if (existingUser) {
          console.log('✅ Found existing user:', existingUser.email);
          
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

          console.log('✅ Test admin user ready:', {
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
      // Clean up auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return;
    }

    console.log('✅ Test admin user created successfully!');
    console.log('📝 Login credentials:');
    console.log('   Email:', testUser.email);
    console.log('   Password:', testUser.password);
    console.log('   Role:', testUser.role);
    console.log('');
    console.log('🌐 You can now test login at: http://localhost:3000/auth/login');

  } catch (error) {
    console.error('💥 Error creating test user:', error.message);
  }
}

createTestAdmin();
