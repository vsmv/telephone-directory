const { exec } = require('child_process');

function testWindowsRecording() {
  console.log('🔍 Testing Windows recording capabilities...');
  
  // Check if we're on Windows
  if (process.platform !== 'win32') {
    console.log('⚠️  This test is only for Windows systems.');
    console.log('💡 For other systems, use your preferred screen recording software.');
    return;
  }
  
  console.log('🖥️  Windows system detected. Checking recording capabilities...');
  
  // Test if PowerShell is available
  exec('powershell -Command "Get-Command xbox" -ErrorAction SilentlyContinue', (error, stdout, stderr) => {
    if (error) {
      console.log('⚠️  PowerShell test failed:', error.message);
    } else {
      console.log('✅ PowerShell is available');
    }
    
    // Check if Videos/Captures folder exists
    const fs = require('fs');
    const capturesPath = `${process.env.USERPROFILE}\\Videos\\Captures`;
    
    fs.access(capturesPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('⚠️  Videos/Captures folder not found. Creating it...');
        fs.mkdir(capturesPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.log('❌ Could not create Captures folder:', mkdirErr.message);
          } else {
            console.log('✅ Created Videos/Captures folder');
          }
        });
      } else {
        console.log('✅ Videos/Captures folder exists');
      }
      
      // Provide instructions
      console.log('\n📋 To use Windows automated recording:');
      console.log('1. Double-click scripts/recordings/windows-record-demo.bat');
      console.log('2. Select the demo you want to record');
      console.log('3. Follow the on-screen instructions');
      console.log('4. Recordings will be saved to your Videos/Captures folder');
      
      console.log('\n🎮 Make sure Xbox Game Bar is enabled:');
      console.log('- Press Win + G to open Game Bar');
      console.log('- If prompted, enable Game Bar');
      console.log('- In Settings → Gaming → Xbox Game Bar, ensure it\'s turned on');
    });
  });
}

testWindowsRecording();