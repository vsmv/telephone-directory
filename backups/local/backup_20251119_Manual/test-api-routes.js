// Test the new API routes
async function testAPIRoutes() {
  console.log('🧪 Testing Secure API Routes\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test Learning Plans API
  console.log('📚 Testing /api/learning-plans...');
  try {
    const response = await fetch(`${baseUrl}/api/learning-plans`);
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ SUCCESS: ${result.data?.length || 0} learning plans fetched`);
      if (result.data && result.data.length > 0) {
        console.log(`   Sample: ${result.data[0].title}`);
      }
    } else {
      console.log(`❌ FAILED: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.log('   Make sure dev server is running: npm run dev');
  }
  
  // Test Patentable Ideas API
  console.log('\n💡 Testing /api/patentable-ideas...');
  try {
    const response = await fetch(`${baseUrl}/api/patentable-ideas`);
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ SUCCESS: ${result.data?.length || 0} patentable ideas fetched`);
      if (result.data && result.data.length > 0) {
        console.log(`   Sample: ${result.data[0].title}`);
      }
    } else {
      console.log(`❌ FAILED: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.log('   Make sure dev server is running: npm run dev');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test complete! If successful, your app should now work.');
  console.log('='.repeat(60) + '\n');
}

testAPIRoutes();
