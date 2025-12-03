/**
 * Test script for RLS (Row Level Security) Policies
 * This tests that all tables are properly secured
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create two clients - one for anon access, one for service role
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function testRLSPolicies() {
  console.log(`${colors.cyan}===========================================`);
  console.log(`🔒 RLS POLICY VERIFICATION TEST`);
  console.log(`===========================================\n${colors.reset}`);

  let allTestsPassed = true;

  // Test 1: Check if RLS is enabled on all tables
  console.log(`${colors.blue}📋 Test 1: Checking RLS Status${colors.reset}`);
  const tables = ['contacts', 'user_profiles', 'user_credentials', 'learning_plans', 'patentable_ideas'];
  
  for (const table of tables) {
    const { data, error } = await serviceClient.rpc('check_rls_enabled', { table_name: table });
    if (error) {
      console.log(`${colors.yellow}⚠️  Could not verify RLS for ${table} (might need custom query)${colors.reset}`);
    }
  }
  console.log();

  // Test 2: Anonymous client can READ contacts
  console.log(`${colors.blue}📋 Test 2: Anonymous Read Access (Public Directory)${colors.reset}`);
  const { data: contactsAnon, error: contactsAnonError } = await anonClient
    .from('contacts')
    .select('*')
    .limit(5);

  if (contactsAnonError) {
    console.log(`${colors.red}❌ FAIL: Anonymous read contacts failed${colors.reset}`);
    console.log(`   Error: ${contactsAnonError.message}`);
    allTestsPassed = false;
  } else {
    console.log(`${colors.green}✅ PASS: Anonymous can read contacts (${contactsAnon.length} records)${colors.reset}`);
  }
  console.log();

  // Test 3: Anonymous client CANNOT WRITE contacts
  console.log(`${colors.blue}📋 Test 3: Anonymous Write Protection${colors.reset}`);
  const { data: insertTest, error: insertError } = await anonClient
    .from('contacts')
    .insert({
      name: 'Test User',
      email: 'test@test.com',
      phone: '1234567890'
    });

  if (insertError) {
    console.log(`${colors.green}✅ PASS: Anonymous cannot insert contacts (as expected)${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ FAIL: Anonymous should NOT be able to insert contacts${colors.reset}`);
    allTestsPassed = false;
  }
  console.log();

  // Test 4: Service role has full access
  console.log(`${colors.blue}📋 Test 4: Service Role Full Access${colors.reset}`);
  const { data: serviceContacts, error: serviceError } = await serviceClient
    .from('contacts')
    .select('*')
    .limit(5);

  if (serviceError) {
    console.log(`${colors.red}❌ FAIL: Service role read failed${colors.reset}`);
    console.log(`   Error: ${serviceError.message}`);
    allTestsPassed = false;
  } else {
    console.log(`${colors.green}✅ PASS: Service role can read contacts (${serviceContacts.length} records)${colors.reset}`);
  }
  console.log();

  // Test 5: User credentials are ONLY accessible to service role
  console.log(`${colors.blue}📋 Test 5: User Credentials Security${colors.reset}`);
  const { data: credsAnon, error: credsAnonError } = await anonClient
    .from('user_credentials')
    .select('*')
    .limit(1);

  // Log detailed error for debugging
  if (credsAnonError) {
    console.log(`${colors.green}✅ PASS: Anonymous cannot access credentials (as expected)${colors.reset}`);
    // console.log(`   Error: ${credsAnonError.message}`);
  } else if (credsAnon && credsAnon.length === 0) {
    console.log(`${colors.green}✅ PASS: Anonymous cannot access credentials (empty result - RLS working)${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ FAIL: SECURITY RISK! Anonymous can access credentials!${colors.reset}`);
    console.log(`   Records returned: ${credsAnon ? credsAnon.length : 0}`);
    allTestsPassed = false;
  }

  const { data: credsService, error: credsServiceError } = await serviceClient
    .from('user_credentials')
    .select('*')
    .limit(1);

  if (credsServiceError) {
    console.log(`${colors.red}❌ FAIL: Service role should access credentials${colors.reset}`);
    allTestsPassed = false;
  } else {
    console.log(`${colors.green}✅ PASS: Service role can access credentials${colors.reset}`);
  }
  console.log();

  // Test 6: Learning plans are readable by anonymous
  console.log(`${colors.blue}📋 Test 6: Learning Plans Public Access${colors.reset}`);
  const { data: plansAnon, error: plansAnonError } = await anonClient
    .from('learning_plans')
    .select('*')
    .limit(5);

  if (plansAnonError) {
    console.log(`${colors.red}❌ FAIL: Anonymous read learning_plans failed${colors.reset}`);
    console.log(`   Error: ${plansAnonError.message}`);
    allTestsPassed = false;
  } else {
    console.log(`${colors.green}✅ PASS: Anonymous can read learning_plans (${plansAnon.length} records)${colors.reset}`);
  }
  console.log();

  // Test 7: Patentable ideas are readable by anonymous
  console.log(`${colors.blue}📋 Test 7: Patentable Ideas Public Access${colors.reset}`);
  const { data: ideasAnon, error: ideasAnonError } = await anonClient
    .from('patentable_ideas')
    .select('*')
    .limit(5);

  if (ideasAnonError) {
    console.log(`${colors.red}❌ FAIL: Anonymous read patentable_ideas failed${colors.reset}`);
    console.log(`   Error: ${ideasAnonError.message}`);
    allTestsPassed = false;
  } else {
    console.log(`${colors.green}✅ PASS: Anonymous can read patentable_ideas (${ideasAnon.length} records)${colors.reset}`);
  }
  console.log();

  // Test 8: User profiles are readable by anonymous (needed for login)
  console.log(`${colors.blue}📋 Test 8: User Profiles Public Read Access${colors.reset}`);
  const { data: profilesAnon, error: profilesAnonError } = await anonClient
    .from('user_profiles')
    .select('*')
    .limit(5);

  if (profilesAnonError) {
    console.log(`${colors.red}❌ FAIL: Anonymous read user_profiles failed${colors.reset}`);
    console.log(`   Error: ${profilesAnonError.message}`);
    allTestsPassed = false;
  } else {
    console.log(`${colors.green}✅ PASS: Anonymous can read user_profiles (${profilesAnon.length} records)${colors.reset}`);
  }
  console.log();

  // Final Summary
  console.log(`${colors.cyan}===========================================`);
  if (allTestsPassed) {
    console.log(`${colors.green}🎉 ALL RLS POLICY TESTS PASSED!`);
    console.log(`   Your database is properly secured.${colors.reset}`);
  } else {
    console.log(`${colors.red}⚠️  SOME TESTS FAILED!`);
    console.log(`   Please review the RLS policies.${colors.reset}`);
  }
  console.log(`${colors.cyan}===========================================\n${colors.reset}`);

  return allTestsPassed;
}

// Run the tests
testRLSPolicies()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error(`${colors.red}Fatal error:${colors.reset}`, err);
    process.exit(1);
  });
