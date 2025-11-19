// Test Supabase connection and data fetching
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg0ODMsImV4cCI6MjA3MjAzNDQ4M30.iR_SFZiXYLVgeXvAMDo4H_SwVdrwaIWQtzI08UeaNYI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Test 1: Contacts
  console.log('📋 Testing contacts table...');
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .limit(5);
  
  if (contactsError) {
    console.error('❌ Contacts Error:', contactsError);
  } else {
    console.log('✅ Contacts:', contacts?.length || 0, 'records found');
    if (contacts && contacts.length > 0) {
      console.log('   Sample:', contacts[0].name);
    }
  }
  
  // Test 2: Learning Plans
  console.log('\n📚 Testing learning_plans table...');
  const { data: plans, error: plansError } = await supabase
    .from('learning_plans')
    .select('*')
    .limit(5);
  
  if (plansError) {
    console.error('❌ Learning Plans Error:', plansError);
  } else {
    console.log('✅ Learning Plans:', plans?.length || 0, 'records found');
    if (plans && plans.length > 0) {
      console.log('   Sample:', plans[0].title);
    }
  }
  
  // Test 3: Patentable Ideas
  console.log('\n💡 Testing patentable_ideas table...');
  const { data: ideas, error: ideasError } = await supabase
    .from('patentable_ideas')
    .select('*')
    .limit(5);
  
  if (ideasError) {
    console.error('❌ Patentable Ideas Error:', ideasError);
  } else {
    console.log('✅ Patentable Ideas:', ideas?.length || 0, 'records found');
    if (ideas && ideas.length > 0) {
      console.log('   Sample:', ideas[0].title);
    }
  }
  
  console.log('\n✨ Test complete!');
}

testConnection().catch(console.error);
