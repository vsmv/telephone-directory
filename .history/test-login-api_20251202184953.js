// Using native fetch (Node 18+)

async function testLoginAPI() {
  const email = 'jeyarish.venki@gmail.com';
  const password = '3nt&irZtWr5Y';
  
  console.log('\n🌐 TESTING LOGIN API ENDPOINT\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESS!');
      console.log('   User ID:', result.user?.id);
      console.log('   Email:', result.user?.email);
      console.log('   Role:', result.user?.role);
    } else {
      console.log('\n❌ LOGIN FAILED!');
      console.log('   Error:', result.error);
    }
    
  } catch (error) {
    console.log('\n💥 REQUEST FAILED!');
    console.log('   Error:', error.message);
    console.log('\n⚠️  Make sure the dev server is running with: npm run dev');
  }
  
  console.log('\n' + '='.repeat(60));
}

testLoginAPI().catch(console.error);
