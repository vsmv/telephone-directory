// Test to verify data access after RLS fix
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg0ODMsImV4cCI6MjA3MjAzNDQ4M30.iR_SFZiXYLVgeXvAMDo4H_SwVdrwaIWQtzI08UeaNYI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAfterFix() {
  console.log('🧪 Testing Data Access After RLS Fix\n');
  console.log('This simulates what your React components will see...\n');
  
  let allPassed = true;
  
  // Test 1: Contacts
  console.log('📋 Testing contacts...');
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*');
  
  if (contactsError) {
    console.log('❌ FAILED:', contactsError.message);
    console.log('   → RLS is still blocking access');
    allPassed = false;
  } else if (!contacts || contacts.length === 0) {
    console.log('⚠️  WARNING: Query succeeded but returned 0 records');
    console.log('   → Either no data exists OR RLS is still blocking');
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: ${contacts.length} contacts found`);
    console.log(`   Sample: ${contacts[0].name} (${contacts[0].email})`);
  }
  
  // Test 2: Learning Plans
  console.log('\n📚 Testing learning_plans...');
  const { data: plans, error: plansError } = await supabase
    .from('learning_plans')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (plansError) {
    console.log('❌ FAILED:', plansError.message);
    console.log('   → RLS is still blocking access OR column name issue');
    allPassed = false;
  } else if (!plans || plans.length === 0) {
    console.log('⚠️  WARNING: Query succeeded but returned 0 records');
    console.log('   → Either no data exists OR RLS is still blocking');
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: ${plans.length} learning plans found`);
    console.log(`   Sample: ${plans[0].title}`);
    console.log(`   Status: ${plans[0].status}`);
    console.log(`   Columns: ${Object.keys(plans[0]).join(', ')}`);
  }
  
  // Test 3: Patentable Ideas
  console.log('\n💡 Testing patentable_ideas...');
  const { data: ideas, error: ideasError } = await supabase
    .from('patentable_ideas')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (ideasError) {
    console.log('❌ FAILED:', ideasError.message);
    console.log('   → RLS is still blocking access OR column name issue');
    allPassed = false;
  } else if (!ideas || ideas.length === 0) {
    console.log('⚠️  WARNING: Query succeeded but returned 0 records');
    console.log('   → Either no data exists OR RLS is still blocking');
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: ${ideas.length} patentable ideas found`);
    console.log(`   Sample: ${ideas[0].title}`);
    console.log(`   Columns: ${Object.keys(ideas[0]).join(', ')}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('\nYour app should now display data correctly.');
    console.log('Next steps:');
    console.log('  1. Start dev server: npm run dev');
    console.log('  2. Open dashboard in browser');
    console.log('  3. Check Learning Plans and Patentable Ideas tabs');
    console.log('  4. Data should be visible! ✨');
  } else {
    console.log('❌ TESTS FAILED');
    console.log('\nThe RLS fix has not been applied yet.');
    console.log('Please run the SQL commands in Supabase Dashboard:');
    console.log('  → See QUICK_FIX.md for instructions');
    console.log('  → Or run the SQL from fix-rls-policies.sql');
  }
  console.log('='.repeat(60) + '\n');
}

testAfterFix().catch(console.error);
