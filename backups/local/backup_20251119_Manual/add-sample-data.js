// Script to add sample data for Priya Sharma
const { createClient } = require('@supabase/supabase-js');

// Use the same configuration as in the app
const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

// Use service role client to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSampleData() {
  console.log('➕ Adding sample data for Priya Sharma...\n');
  
  const userEmail = 'priya.sharma@actrec.gov.in';
  
  try {
    // Add 2 learning plans
    console.log('📚 Adding Learning Plans...');
    const learningPlans = [
      {
        email: userEmail,
        title: 'Advanced Radiology Techniques',
        description: 'Study and implement advanced radiology techniques for improved diagnostic accuracy',
        category: 'Professional Development',
        status: 'in-progress',
        target_completion_date: '2025-12-31'
      },
      {
        email: userEmail,
        title: 'Patient Communication Skills',
        description: 'Enhance communication skills for better patient care and satisfaction',
        category: 'Soft Skills',
        status: 'not-started',
        target_completion_date: '2026-03-31'
      }
    ];
    
    const { data: plansData, error: plansError } = await supabase
      .from('learning_plans')
      .insert(learningPlans);
    
    if (plansError) {
      console.error('Error adding learning plans:', plansError);
    } else {
      console.log('✅ Learning plans added successfully');
    }
    
    // Add 2 patentable ideas
    console.log('\n💡 Adding Patentable Ideas...');
    const patentableIdeas = [
      {
        email: userEmail,
        title: 'AI-Powered Diagnostic Tool',
        description: 'Development of an AI-powered tool for early cancer detection using radiological images',
        category: 'Technology',
        status: 'draft'
      },
      {
        email: userEmail,
        title: 'Radiation Therapy Optimization',
        description: 'Novel approach to optimize radiation therapy dosages for improved patient outcomes',
        category: 'Medical',
        status: 'submitted'
      }
    ];
    
    const { data: ideasData, error: ideasError } = await supabase
      .from('patentable_ideas')
      .insert(patentableIdeas);
    
    if (ideasError) {
      console.error('Error adding patentable ideas:', ideasError);
    } else {
      console.log('✅ Patentable ideas added successfully');
    }
    
    // Verify the data was added
    console.log('\n🔍 Verifying data...');
    
    // Check learning plans
    const { data: plans, error: plansCheckError } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('email', userEmail);
    
    if (plansCheckError) {
      console.error('Error verifying learning plans:', plansCheckError);
    } else {
      console.log(`📚 Learning plans for ${userEmail}: ${plans?.length || 0}`);
      if (plans && plans.length > 0) {
        plans.forEach((plan, index) => {
          console.log(`  ${index + 1}. ${plan.title} (${plan.status})`);
        });
      }
    }
    
    // Check patentable ideas
    const { data: ideas, error: ideasCheckError } = await supabase
      .from('patentable_ideas')
      .select('*')
      .eq('email', userEmail);
    
    if (ideasCheckError) {
      console.error('Error verifying patentable ideas:', ideasCheckError);
    } else {
      console.log(`💡 Patentable ideas for ${userEmail}: ${ideas?.length || 0}`);
      if (ideas && ideas.length > 0) {
        ideas.forEach((idea, index) => {
          console.log(`  ${index + 1}. ${idea.title} (${idea.status})`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Error adding sample data:', error);
  }
  
  console.log('\n🏁 Sample data addition completed');
}

addSampleData();