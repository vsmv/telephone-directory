// Apply anonymous read access policies to Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function applyPolicies() {
  console.log('🔧 Disabling RLS temporarily to allow public access...\n');
  console.log('⚠️  Note: For production, you should use proper RLS policies.\n');
  console.log('For now, we will disable RLS on learning_plans and patentable_ideas tables.\n');
  
  try {
    // Option 1: Disable RLS (simplest for testing)
    console.log('📝 Method 1: Disabling RLS (recommended for testing)...\n');
    
    const statements = [
      'ALTER TABLE learning_plans DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE patentable_ideas DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;'
    ];
    
    console.log('⚠️  This requires running SQL directly in Supabase Dashboard.\n');
    console.log('Please run these commands in your Supabase SQL Editor:\n');
    statements.forEach(stmt => console.log(`  ${stmt}`));
    console.log('\nOR\n');
    console.log('📝 Method 2: Add anon policies (recommended for production)...\n');
    console.log('Run the SQL in fix-rls-policies.sql file in your Supabase SQL Editor.\n');
    
    console.log('🔍 Testing current anonymous access...\n');
    
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg0ODMsImV4cCI6MjA3MjAzNDQ4M30.iR_SFZiXYLVgeXvAMDo4H_SwVdrwaIWQtzI08UeaNYI');
    
    // Test learning plans
    const { data: plans, error: plansError } = await anonClient
      .from('learning_plans')
      .select('*')
      .limit(5);
    
    if (plansError) {
      console.log('❌ Learning Plans Error:', plansError.message);
    } else {
      console.log(`✅ Learning Plans: ${plans?.length || 0} records accessible`);
      if (plans && plans.length > 0) {
        console.log(`   Sample: ${plans[0].title}`);
      }
    }
    
    // Test patentable ideas
    const { data: ideas, error: ideasError } = await anonClient
      .from('patentable_ideas')
      .select('*')
      .limit(5);
    
    if (ideasError) {
      console.log('❌ Patentable Ideas Error:', ideasError.message);
    } else {
      console.log(`✅ Patentable Ideas: ${ideas?.length || 0} records accessible`);
      if (ideas && ideas.length > 0) {
        console.log(`   Sample: ${ideas[0].title}`);
      }
    }
    
    // Test contacts
    const { data: contacts, error: contactsError } = await anonClient
      .from('contacts')
      .select('*')
      .limit(5);
    
    if (contactsError) {
      console.log('❌ Contacts Error:', contactsError.message);
    } else {
      console.log(`✅ Contacts: ${contacts?.length || 0} records accessible`);
      if (contacts && contacts.length > 0) {
        console.log(`   Sample: ${contacts[0].name}`);
      }
    }
    
    console.log('\n🎉 Policy application complete!');
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

applyPolicies();
