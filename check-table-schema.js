// Check actual table schema and data in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

// Use service role to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('🔍 Checking Table Schema and Data\n');
  
  // Check contacts
  console.log('📋 CONTACTS TABLE:');
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .limit(2);
  
  if (contactsError) {
    console.log('❌ Error:', contactsError.message);
  } else {
    console.log(`   Records: ${contacts?.length || 0}`);
    if (contacts && contacts.length > 0) {
      console.log('   Columns:', Object.keys(contacts[0]).join(', '));
      console.log('   Sample:', JSON.stringify(contacts[0], null, 2));
    }
  }
  
  // Check learning_plans
  console.log('\n📚 LEARNING_PLANS TABLE:');
  const { data: plans, error: plansError } = await supabase
    .from('learning_plans')
    .select('*')
    .limit(2);
  
  if (plansError) {
    console.log('❌ Error:', plansError.message);
  } else {
    console.log(`   Records: ${plans?.length || 0}`);
    if (plans && plans.length > 0) {
      console.log('   Columns:', Object.keys(plans[0]).join(', '));
      console.log('   Sample:', JSON.stringify(plans[0], null, 2));
    }
  }
  
  // Check patentable_ideas
  console.log('\n💡 PATENTABLE_IDEAS TABLE:');
  const { data: ideas, error: ideasError } = await supabase
    .from('patentable_ideas')
    .select('*')
    .limit(2);
  
  if (ideasError) {
    console.log('❌ Error:', ideasError.message);
  } else {
    console.log(`   Records: ${ideas?.length || 0}`);
    if (ideas && ideas.length > 0) {
      console.log('   Columns:', Object.keys(ideas[0]).join(', '));
      console.log('   Sample:', JSON.stringify(ideas[0], null, 2));
    }
  }
  
  // Check RLS status
  console.log('\n🔒 Checking RLS Status:');
  const { data: rlsStatus, error: rlsError } = await supabase
    .rpc('check_rls_status');
  
  if (rlsError) {
    console.log('   (Cannot check RLS status via RPC)');
    console.log('   Using service role key - bypasses RLS');
  }
  
  console.log('\n✅ Schema check complete!\n');
}

checkSchema().catch(console.error);
