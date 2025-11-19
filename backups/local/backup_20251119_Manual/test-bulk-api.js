// Test bulk operations API
async function testBulkAPI() {
  console.log('🧪 Testing Bulk Operations API\n');
  
  // First, get some contact IDs
  console.log('1️⃣ Getting contact IDs...');
  const getResponse = await fetch('http://localhost:3000/api/contacts');
  const getResult = await getResponse.json();
  
  if (!getResult.data || getResult.data.length === 0) {
    console.log('❌ No contacts found to test with');
    return;
  }
  
  const testIds = getResult.data.slice(0, 2).map(c => c.id);
  console.log(`✅ Got ${testIds.length} contact IDs for testing`);
  console.log('   IDs:', testIds);
  
  // Test bulk update
  console.log('\n2️⃣ Testing bulk update...');
  const updateResponse = await fetch('http://localhost:3000/api/contacts/bulk', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: testIds,
      updates: {
        department: 'BULK TEST DEPARTMENT'
      }
    })
  });
  
  console.log('   Response status:', updateResponse.status);
  const updateResult = await updateResponse.json();
  console.log('   Response:', JSON.stringify(updateResult, null, 2));
  
  if (updateResponse.ok && updateResult.data) {
    console.log(`✅ Bulk update successful: ${updateResult.data.length} contacts updated`);
  } else {
    console.log('❌ Bulk update failed:', updateResult.error);
  }
  
  // Verify the update
  console.log('\n3️⃣ Verifying update...');
  const verifyResponse = await fetch('http://localhost:3000/api/contacts');
  const verifyResult = await verifyResponse.json();
  
  const updatedContacts = verifyResult.data.filter(c => 
    testIds.includes(c.id) && c.department === 'BULK TEST DEPARTMENT'
  );
  
  console.log(`   Found ${updatedContacts.length} contacts with updated department`);
  
  if (updatedContacts.length === testIds.length) {
    console.log('✅ Bulk update verified successfully!');
  } else {
    console.log('⚠️  Some contacts were not updated');
  }
  
  // Revert the test changes
  console.log('\n4️⃣ Reverting test changes...');
  await fetch('http://localhost:3000/api/contacts/bulk', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: testIds,
      updates: {
        department: 'IT Department'
      }
    })
  });
  console.log('✅ Test changes reverted');
  
  console.log('\n✅ Bulk API test complete!');
}

testBulkAPI().catch(console.error);