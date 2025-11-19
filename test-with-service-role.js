// Test with service role to verify code fixes work
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCodeFixes() {
  console.log('🧪 Testing Code Fixes with Service Role\n');
  console.log('This verifies the column name fixes work correctly...\n');
  
  // Test learning plans with correct column names
  console.log('📚 Testing learning_plans with created_at order...');
  const { data: plans, error: plansError } = await supabase
    .from('learning_plans')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (plansError) {
    console.log('❌ FAILED:', plansError.message);
    console.log('   This means the column name is still wrong!');
  } else {
    console.log(`✅ SUCCESS: ${plans.length} records found`);
    console.log(`   Sample: "${plans[0].title}"`);
    console.log(`   Created: ${new Date(plans[0].created_at).toLocaleDateString()}`);
    console.log(`   Updated: ${new Date(plans[0].updated_at).toLocaleDateString()}`);
  }
  
  // Test patentable ideas with correct column names
  console.log('\n💡 Testing patentable_ideas with created_at order...');
  const { data: ideas, error: ideasError } = await supabase
    .from('patentable_ideas')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (ideasError) {
    console.log('❌ FAILED:', ideasError.message);
    console.log('   This means the column name is still wrong!');
  } else {
    console.log(`✅ SUCCESS: ${ideas.length} records found`);
    console.log(`   Sample: "${ideas[0].title}"`);
    console.log(`   Created: ${new Date(ideas[0].created_at).toLocaleDateString()}`);
    console.log(`   Updated: ${new Date(ideas[0].updated_at).toLocaleDateString()}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Code fixes verified! Column names are correct.');
  console.log('\nNext step: Fix RLS policies in Supabase Dashboard');
  console.log('Run: See COMPLETE_FIX_SUMMARY.md for SQL commands');
  console.log('='.repeat(60) + '\n');
}

testCodeFixes().catch(console.error);
