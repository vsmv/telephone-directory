// Test script to check database connectivity and data persistence
const { learningPlanService, patentableIdeaService, testDatabaseTables } = require('./dist/lib/database');

async function testDatabase() {
  console.log('🧪 Testing Database Connection and Data Persistence...');

  try {
    // Test database tables
    console.log('📊 Testing database tables...');
    await testDatabaseTables();

    // Test learning plans
    console.log('📚 Testing learning plans...');
    const plansResult = await learningPlanService.getPlans();
    console.log('Learning plans result:', {
      success: !plansResult.error,
      count: plansResult.data?.length || 0,
      error: plansResult.error,
      sample: plansResult.data?.[0]
    });

    // Test patentable ideas
    console.log('💡 Testing patentable ideas...');
    const ideasResult = await patentableIdeaService.getIdeas();
    console.log('Patentable ideas result:', {
      success: !ideasResult.error,
      count: ideasResult.data?.length || 0,
      error: ideasResult.error,
      sample: ideasResult.data?.[0]
    });

    // Test creating a sample learning plan
    console.log('➕ Testing learning plan creation...');
    const testPlan = {
      email: 'user@actrec.gov.in',
      title: 'Test Learning Plan - ' + Date.now(),
      description: 'Test plan for database connectivity',
      category: 'Testing',
      status: 'not-started',
      target_completion_date: null
    };

    const createResult = await learningPlanService.createPlan(testPlan);
    console.log('Create learning plan result:', {
      success: !createResult.error,
      data: createResult.data,
      error: createResult.error
    });

    // Test creating a sample patentable idea
    console.log('➕ Testing patentable idea creation...');
    const testIdea = {
      email: 'user@actrec.gov.in',
      title: 'Test Patentable Idea - ' + Date.now(),
      description: 'Test idea for database connectivity',
      category: 'Testing',
      status: 'draft'
    };

    const createIdeaResult = await patentableIdeaService.createIdea(testIdea);
    console.log('Create patentable idea result:', {
      success: !createIdeaResult.error,
      data: createIdeaResult.data,
      error: createIdeaResult.error
    });

    // Re-fetch data to verify persistence
    console.log('🔄 Re-fetching data to verify persistence...');
    const plansAfter = await learningPlanService.getPlans();
    const ideasAfter = await patentableIdeaService.getIdeas();

    console.log('Data after creation:', {
      plans: plansAfter.data?.length || 0,
      ideas: ideasAfter.data?.length || 0
    });

    // Filter for user@actrec.gov.in
    const userPlans = plansAfter.data?.filter(p => p.email === 'user@actrec.gov.in') || [];
    const userIdeas = ideasAfter.data?.filter(i => i.email === 'user@actrec.gov.in') || [];

    console.log('User-specific data:', {
      userPlans: userPlans.length,
      userIdeas: userIdeas.length,
      samplePlan: userPlans[0],
      sampleIdea: userIdeas[0]
    });

  } catch (error) {
    console.error('💥 Database test failed:', error);
  }
}

// Run the test
testDatabase().catch(console.error);
