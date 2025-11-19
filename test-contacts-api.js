// Test contacts API
async function testContactsAPI() {
  console.log('📋 Testing Contacts API\n');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/contacts`);
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ SUCCESS: ${result.data?.length || 0} contacts fetched`);
      if (result.data && result.data.length > 0) {
        console.log(`   Sample: ${result.data[0].name} (${result.data[0].email})`);
      }
    } else {
      console.log(`❌ FAILED: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

testContactsAPI();