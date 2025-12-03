const fetch = require('node-fetch');

async function testContactsAPI() {
  console.log('\n🧪 Testing /api/contacts endpoint\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/contacts');
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.data) {
      console.log(`\n✅ Found ${result.data.length} contacts:\n`);
      result.data.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.name} (${contact.email})`);
      });
    } else {
      console.log('❌ No data in response');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testContactsAPI();
