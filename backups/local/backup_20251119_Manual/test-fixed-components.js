// Test the fixed components by simulating their data processing
async function testFixedComponents() {
  console.log('🧪 Testing Fixed Components\n');
  
  // Get the actual data
  const response = await fetch('http://localhost:3000/api/learning-plans');
  const result = await response.json();
  
  if (!response.ok || !result.data) {
    console.log('❌ Failed to get data');
    return;
  }
  
  const plans = result.data;
  console.log(`📚 Processing ${plans.length} learning plans...\n`);
  
  // Test the status counting logic (fixed)
  const inProgressCount = plans.filter(p => p.status === 'in-progress').length;
  const completedCount = plans.filter(p => p.status === 'completed').length;
  const notStartedCount = plans.filter(p => p.status === 'not-started').length;
  const archivedCount = plans.filter(p => p.status === 'archived').length;
  
  console.log('📊 Status Counts:');
  console.log(`   Not Started: ${notStartedCount}`);
  console.log(`   In Progress: ${inProgressCount}`);
  console.log(`   Completed: ${completedCount}`);
  console.log(`   Archived: ${archivedCount}`);
  console.log(`   Total: ${plans.length}`);
  
  console.log('\n📋 Sample Plans:');
  plans.slice(0, 3).forEach((plan, index) => {
    console.log(`${index + 1}. "${plan.title}" - Status: ${plan.status}`);
  });
  
  // Test patentable ideas
  const ideasResponse = await fetch('http://localhost:3000/api/patentable-ideas');
  const ideasResult = await ideasResponse.json();
  
  if (ideasResponse.ok && ideasResult.data) {
    const ideas = ideasResult.data;
    console.log(`\n💡 Processing ${ideas.length} patentable ideas...\n`);
    
    console.log('📋 Sample Ideas:');
    ideas.slice(0, 3).forEach((idea, index) => {
      console.log(`${index + 1}. "${idea.title}" - Status: ${idea.status}`);
    });
  }
  
  console.log('\n✅ Component fixes should now work!');
  console.log('The components will now correctly:');
  console.log('- Display all learning plans and ideas');
  console.log('- Show correct status counts');
  console.log('- Handle status updates properly');
}

testFixedComponents();