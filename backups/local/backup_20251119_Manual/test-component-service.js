// Test what happens when components call the service
async function testComponentService() {
  console.log('🧪 Testing Component Service Calls\n');
  
  // Simulate what the learning plans component does
  console.log('📚 Testing Learning Plans Service Call...');
  
  try {
    // This is what the component calls
    const response = await fetch('http://localhost:3000/api/learning-plans');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Raw result:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      console.log('❌ API Error:', result.error || 'Failed to fetch plans');
    } else {
      console.log('✅ API Success:', result.data?.length || 0, 'plans');
      
      // Show what the component would receive
      if (result.data && result.data.length > 0) {
        console.log('\nSample plan the component would receive:');
        console.log(JSON.stringify(result.data[0], null, 2));
      }
    }
  } catch (error) {
    console.log('💥 Fetch Error:', error.message);
  }
  
  // Test Patentable Ideas Service Call
  console.log('\n💡 Testing Patentable Ideas Service Call...');
  
  try {
    const response = await fetch('http://localhost:3000/api/patentable-ideas');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Raw result:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      console.log('❌ API Error:', result.error || 'Failed to fetch ideas');
    } else {
      console.log('✅ API Success:', result.data?.length || 0, 'ideas');
      
      if (result.data && result.data.length > 0) {
        console.log('\nSample idea the component would receive:');
        console.log(JSON.stringify(result.data[0], null, 2));
      }
    }
  } catch (error) {
    console.log('💥 Fetch Error:', error.message);
  }
  
  console.log('\n✅ Component service test complete');
}

testComponentService();