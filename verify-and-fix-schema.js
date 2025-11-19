// Verify current schema and fix any issues
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySchema() {
  console.log('🔍 Verifying Current Database Schema\n');
  
  // Check learning_plans table structure
  console.log('📚 Learning Plans Table Structure:');
  const { data: learningPlans, error: lpError } = await supabase
    .from('learning_plans')
    .select('*')
    .limit(1);
  
  if (lpError) {
    console.log('❌ Error:', lpError.message);
  } else if (learningPlans && learningPlans.length > 0) {
    console.log('✅ Columns:', Object.keys(learningPlans[0]).join(', '));
    console.log('✅ Sample record:', learningPlans[0]);
  } else {
    console.log('⚠️  No records found');
  }
  
  // Check patentable_ideas table structure
  console.log('\n💡 Patentable Ideas Table Structure:');
  const { data: ideas, error: ideasError } = await supabase
    .from('patentable_ideas')
    .select('*')
    .limit(1);
  
  if (ideasError) {
    console.log('❌ Error:', ideasError.message);
  } else if (ideas && ideas.length > 0) {
    console.log('✅ Columns:', Object.keys(ideas[0]).join(', '));
    console.log('✅ Sample record:', ideas[0]);
  } else {
    console.log('⚠️  No records found');
  }
  
  // Check contacts table structure
  console.log('\n📋 Contacts Table Structure:');
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .limit(1);
  
  if (contactsError) {
    console.log('❌ Error:', contactsError.message);
  } else if (contacts && contacts.length > 0) {
    console.log('✅ Columns:', Object.keys(contacts[0]).join(', '));
    console.log('✅ Sample record:', contacts[0]);
  } else {
    console.log('⚠️  No records found');
  }
  
  // Test CASCADE DELETE
  console.log('\n🔗 Testing CASCADE DELETE Relationships...');
  
  const testEmail = 'cascade.test.schema@actrec.gov.in';
  
  try {
    // Create test contact
    console.log('1️⃣ Creating test contact...');
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert({
        name: 'Schema Test User',
        email: testEmail,
        extension: '9998',
        department: 'Test',
        designation: 'Tester',
        phone_number: '1234567890',
        location: 'Test Lab',
        institution: 'ACTREC'
      })
      .select()
      .single();
    
    if (contactError) {
      console.log('❌ Contact creation failed:', contactError.message);
      return;
    }
    console.log('✅ Contact created');
    
    // Create test learning plan
    console.log('2️⃣ Creating test learning plan...');
    const { data: plan, error: planError } = await supabase
      .from('learning_plans')
      .insert({
        email: testEmail,
        title: 'Schema Test Plan',
        description: 'Testing schema relationships',
        category: 'Testing'
      })
      .select()
      .single();
    
    if (planError) {
      console.log('❌ Learning plan creation failed:', planError.message);
    } else {
      console.log('✅ Learning plan created');
    }
    
    // Create test patentable idea
    console.log('3️⃣ Creating test patentable idea...');
    const { data: idea, error: ideaError } = await supabase
      .from('patentable_ideas')
      .insert({
        email: testEmail,
        title: 'Schema Test Idea',
        description: 'Testing schema relationships',
        category: 'Testing'
      })
      .select()
      .single();
    
    if (ideaError) {
      console.log('❌ Patentable idea creation failed:', ideaError.message);
    } else {
      console.log('✅ Patentable idea created');
    }
    
    // Verify records exist
    console.log('4️⃣ Verifying records exist...');
    const { data: allPlans } = await supabase.from('learning_plans').select('*').eq('email', testEmail);
    const { data: allIdeas } = await supabase.from('patentable_ideas').select('*').eq('email', testEmail);
    
    console.log(`📊 Before delete - Plans: ${allPlans?.length || 0}, Ideas: ${allIdeas?.length || 0}`);
    
    // Test CASCADE DELETE
    console.log('5️⃣ Testing CASCADE DELETE...');
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .eq('email', testEmail);
    
    if (deleteError) {
      console.log('❌ Contact deletion failed:', deleteError.message);
    } else {
      console.log('✅ Contact deleted');
    }
    
    // Verify cascade worked
    console.log('6️⃣ Verifying cascade delete...');
    const { data: remainingPlans } = await supabase.from('learning_plans').select('*').eq('email', testEmail);
    const { data: remainingIdeas } = await supabase.from('patentable_ideas').select('*').eq('email', testEmail);
    
    console.log(`📊 After delete - Plans: ${remainingPlans?.length || 0}, Ideas: ${remainingIdeas?.length || 0}`);
    
    if ((remainingPlans?.length || 0) === 0 && (remainingIdeas?.length || 0) === 0) {
      console.log('✅ CASCADE DELETE working correctly!');
    } else {
      console.log('⚠️  CASCADE DELETE may not be working');
    }
    
  } catch (error) {
    console.log('💥 Test failed:', error.message);
  }
  
  console.log('\n✅ Schema verification complete');
}

verifySchema();