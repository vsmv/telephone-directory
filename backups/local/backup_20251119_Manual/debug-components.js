// Debug the component data fetching
async function debugComponents() {
  console.log('🔍 Debugging Component Data Fetching\n');
  
  // Test Learning Plans Service
  console.log('📚 Testing Learning Plans Service...');
  try {
    const response = await fetch('http://localhost:3000/api/learning-plans');
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.data) {
      console.log(`✅ Learning Plans API: ${result.data.length} records`);
      console.log('Sample record:', result.data[0]);
    } else {
      console.log('❌ Learning Plans API failed:', result.error);
    }
  } catch (error) {
    console.log('💥 Learning Plans API error:', error.message);
  }
  
  // Test Patentable Ideas Service
  console.log('\n💡 Testing Patentable Ideas Service...');
  try {
    const response = await fetch('http://localhost:3000/api/patentable-ideas');
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.data) {
      console.log(`✅ Patentable Ideas API: ${result.data.length} records`);
      console.log('Sample record:', result.data[0]);
    } else {
      console.log('❌ Patentable Ideas API failed:', result.error);
    }
  } catch (error) {
    console.log('💥 Patentable Ideas API error:', error.message);
  }
  
  // Test the service classes directly
  console.log('\n🔧 Testing Service Classes...');
  
  // Import and test (this won't work in Node.js but shows the pattern)
  console.log('Note: Service classes use fetch() which works in browser context');
  console.log('The components should be able to call these services successfully');
  
  console.log('\n✅ Debug complete');
}

debugComponents();