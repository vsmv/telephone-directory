const { spawn } = require('child_process');
const path = require('path');

async function runDemoScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`🎬 Starting ${scriptName}...`);
    
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${scriptName} completed successfully`);
        resolve();
      } else {
        console.log(`❌ ${scriptName} exited with code ${code}`);
        reject(new Error(`${scriptName} failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.log(`💥 Error running ${scriptName}:`, error);
      reject(error);
    });
  });
}

async function runAllDemos() {
  console.log('🚀 Starting Full Demo Recording Suite...');
  console.log('==========================================');
  
  try {
    // Run Admin Demo
    console.log('\n1️⃣  ADMIN DEMO');
    console.log('==============');
    await runDemoScript('admin-demo.js');
    
    // Small delay between demos
    console.log('⏳ Waiting before next demo...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Run User Demo
    console.log('\n2️⃣  USER DEMO');
    console.log('=============');
    await runDemoScript('user-demo.js');
    
    // Small delay between demos
    console.log('⏳ Waiting before next demo...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Run Public Search Demo
    console.log('\n3️⃣  PUBLIC SEARCH DEMO');
    console.log('=====================');
    await runDemoScript('public-search-demo.js');
    
    console.log('\n🎉 ALL DEMOS COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('📁 Recording files are saved in the scripts/recordings/ directory');
    
  } catch (error) {
    console.error('❌ Error during demo execution:', error);
    process.exit(1);
  }
}

// Run all demos
runAllDemos().catch(console.error);