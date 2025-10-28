const http = require('http');

function testConnection() {
  console.log('🔍 Testing connection to http://localhost:3001...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET',
    timeout: 5000
  };
  
  const req = http.request(options, (res) => {
    console.log(`✅ Server is running! Status: ${res.statusCode}`);
    console.log(`📝 Content-Type: ${res.headers['content-type']}`);
    
    if (res.statusCode === 200) {
      console.log('🎉 Application is ready for demo recording!');
      console.log('\nTo start recording, run one of the following commands:');
      console.log('  npm run demo:admin     # Record admin demo');
      console.log('  npm run demo:user      # Record user demo');
      console.log('  npm run demo:public    # Record public search demo');
      console.log('  npm run demo:full      # Record all demos sequentially');
    }
  });
  
  req.on('error', (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused. Please make sure the application is running:');
      console.log('   1. Open a new terminal');
      console.log('   2. Run: npm run dev');
      console.log('   3. Wait for the server to start');
      console.log('   4. Run this test script again');
    } else {
      console.log(`❌ Error: ${error.message}`);
    }
  });
  
  req.on('timeout', () => {
    console.log('❌ Request timeout. Server might be busy or not responding.');
    req.destroy();
  });
  
  req.end();
}

testConnection();