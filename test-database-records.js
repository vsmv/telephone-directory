const { supabase } = require('./lib/supabase');

async function testDatabaseRecords() {
  console.log('🔍 Testing database records...');
  
  try {
    // Test 1: Check if there are any learning plans at all
    console.log('\n--- Testing Learning Plans ---');
    const { data: allPlans, error: plansError } = await supabase
      .from('learning_plans')
      .select('*');
    
    console.log('All learning plans:', allPlans?.length || 0);
    if (allPlans && allPlans.length > 0) {
      console.log('Sample learning plan:', allPlans[0]);
    }
    if (plansError) {
      console.error('Error fetching learning plans:', plansError);
    }
    
    // Test 2: Check if there are any learning plans for the specific user
    const userEmail = 'priya.sharma@actrec.gov.in';
    console.log(`\n--- Testing Learning Plans for ${userEmail} ---`);
    const { data: userPlans, error: userPlansError } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('email', userEmail);
    
    console.log(`Learning plans for ${userEmail}:`, userPlans?.length || 0);
    if (userPlans && userPlans.length > 0) {
      console.log('Sample user learning plan:', userPlans[0]);
    }
    if (userPlansError) {
      console.error('Error fetching user learning plans:', userPlansError);
    }
    
    // Test 3: Check if there are any patentable ideas at all
    console.log('\n--- Testing Patentable Ideas ---');
    const { data: allIdeas, error: ideasError } = await supabase
      .from('patentable_ideas')
      .select('*');
    
    console.log('All patentable ideas:', allIdeas?.length || 0);
    if (allIdeas && allIdeas.length > 0) {
      console.log('Sample patentable idea:', allIdeas[0]);
    }
    if (ideasError) {
      console.error('Error fetching patentable ideas:', ideasError);
    }
    
    // Test 4: Check if there are any patentable ideas for the specific user
    console.log(`\n--- Testing Patentable Ideas for ${userEmail} ---`);
    const { data: userIdeas, error: userIdeasError } = await supabase
      .from('patentable_ideas')
      .select('*')
      .eq('email', userEmail);
    
    console.log(`Patentable ideas for ${userEmail}:`, userIdeas?.length || 0);
    if (userIdeas && userIdeas.length > 0) {
      console.log('Sample user patentable idea:', userIdeas[0]);
    }
    if (userIdeasError) {
      console.error('Error fetching user patentable ideas:', userIdeasError);
    }
    
    // Test 5: Check if the user exists in user_profiles
    console.log(`\n--- Testing User Profile for ${userEmail} ---`);
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', userEmail);
    
    console.log(`User profile for ${userEmail}:`, userProfile?.length || 0);
    if (userProfile && userProfile.length > 0) {
      console.log('User profile:', userProfile[0]);
    }
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
  
  console.log('\n🏁 Database test completed');
}

// Run the test
testDatabaseRecords().catch(console.error);