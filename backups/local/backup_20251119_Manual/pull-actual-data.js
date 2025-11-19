// Pull actual data from tables to see what we're working with
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function pullActualData() {
  console.log('📊 PULLING ACTUAL DATA FROM TABLES\n');
  
  // Pull Learning Plans
  console.log('📚 LEARNING PLANS DATA:');
  console.log('='.repeat(50));
  const { data: plans, error: plansError } = await supabase
    .from('learning_plans')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (plansError) {
    console.log('❌ Error:', plansError.message);
  } else {
    console.log(`Found ${plans?.length || 0} learning plans:`);
    plans?.forEach((plan, index) => {
      console.log(`\n${index + 1}. ${plan.title}`);
      console.log(`   ID: ${plan.id}`);
      console.log(`   Email: ${plan.email}`);
      console.log(`   Category: ${plan.category}`);
      console.log(`   Status: ${plan.status}`);
      console.log(`   Description: ${plan.description?.substring(0, 100)}...`);
      console.log(`   Created: ${plan.created_at}`);
    });
  }
  
  // Pull Patentable Ideas
  console.log('\n\n💡 PATENTABLE IDEAS DATA:');
  console.log('='.repeat(50));
  const { data: ideas, error: ideasError } = await supabase
    .from('patentable_ideas')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (ideasError) {
    console.log('❌ Error:', ideasError.message);
  } else {
    console.log(`Found ${ideas?.length || 0} patentable ideas:`);
    ideas?.forEach((idea, index) => {
      console.log(`\n${index + 1}. ${idea.title}`);
      console.log(`   ID: ${idea.id}`);
      console.log(`   Email: ${idea.email}`);
      console.log(`   Category: ${idea.category}`);
      console.log(`   Status: ${idea.status}`);
      console.log(`   Description: ${idea.description?.substring(0, 100)}...`);
      console.log(`   Created: ${idea.created_at}`);
    });
  }
  
  // Test API Routes
  console.log('\n\n🔌 TESTING API ROUTES:');
  console.log('='.repeat(50));
  
  try {
    const learningResponse = await fetch('http://localhost:3000/api/learning-plans');
    const learningResult = await learningResponse.json();
    console.log('Learning Plans API Status:', learningResponse.status);
    console.log('Learning Plans API Data Count:', learningResult.data?.length || 0);
    if (learningResult.error) {
      console.log('Learning Plans API Error:', learningResult.error);
    }
  } catch (error) {
    console.log('Learning Plans API Error:', error.message);
  }
  
  try {
    const ideasResponse = await fetch('http://localhost:3000/api/patentable-ideas');
    const ideasResult = await ideasResponse.json();
    console.log('Patentable Ideas API Status:', ideasResponse.status);
    console.log('Patentable Ideas API Data Count:', ideasResult.data?.length || 0);
    if (ideasResult.error) {
      console.log('Patentable Ideas API Error:', ideasResult.error);
    }
  } catch (error) {
    console.log('Patentable Ideas API Error:', error.message);
  }
  
  console.log('\n✅ Data pull complete');
}

pullActualData();