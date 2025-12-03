/**
 * Puppeteer Test Script for ACTREC Telephone Directory
 * Tests login, dashboard access, and checks for errors
 */

const puppeteer = require('puppeteer');

async function testApplication() {
  console.log('🚀 Starting Puppeteer test...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Capture console logs and errors
    const consoleLogs = [];
    const errors = [];
    
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', text);
        errors.push(text);
      }
    });
    
    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
      errors.push(error.message);
    });

    // Test 1: Load Home Page
    console.log('📋 Test 1: Loading home page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Home page loaded\n');

    // Test 2: Navigate to Login
    console.log('📋 Test 2: Navigating to login page...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if login form exists
    const loginForm = await page.$('input[type="email"]');
    if (loginForm) {
      console.log('✅ Login form found\n');
    } else {
      console.log('❌ Login form not found\n');
      errors.push('Login form not found');
    }

    // Test 3: Login with Email
    console.log('📋 Test 3: Logging in with jeyarish.venki@gmail.com...');
    await page.type('input[type="email"]', 'jeyarish.venki@gmail.com', { delay: 50 });
    await page.type('input[type="password"]', '3nt&irZtWr5Y', { delay: 50 });
    console.log('   Email: jeyarish.venki@gmail.com');
    console.log('   Password: 3nt***');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Click login button
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if redirected to dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully logged in and redirected to dashboard\n');
    } else {
      console.log('❌ Login failed or redirect issue. Current URL:', currentUrl, '\n');
      errors.push('Login redirect failed');
    }

    // Test 4: Check Dashboard Tabs
    console.log('📋 Test 4: Checking dashboard tabs...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for tab buttons
    const tabs = await page.$$('[role="tablist"] button');
    console.log(`✅ Found ${tabs.length} tabs\n`);

    // Test 5: Navigate to Study Plans Tab
    console.log('📋 Test 5: Navigating to Study Plans tab...');
    try {
      // Click the tab using value attribute
      await page.click('button[value="learning"]');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for "Not authenticated" error
      const pageContent = await page.content();
      if (pageContent.includes('Not authenticated')) {
        console.log('❌ "Not authenticated" error found in Study Plans\n');
        errors.push('Not authenticated error in Study Plans');
      } else {
        console.log('✅ Study Plans tab loaded without authentication errors\n');
      }
    } catch (e) {
      console.log('⚠️ Could not navigate to Study Plans tab:', e.message, '\n');
    }

    // Test 6: Navigate to Patentable Ideas Tab
    console.log('📋 Test 6: Navigating to Patentable Ideas tab...');
    try {
      // Click the tab using value attribute
      await page.click('button[value="patents"]');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for "Not authenticated" error
      const pageContent = await page.content();
      if (pageContent.includes('Not authenticated')) {
        console.log('❌ "Not authenticated" error found in Patentable Ideas\n');
        errors.push('Not authenticated error in Patentable Ideas');
      } else {
        console.log('✅ Patentable Ideas tab loaded without authentication errors\n');
      }
    } catch (e) {
      console.log('⚠️ Could not navigate to Patentable Ideas tab:', e.message, '\n');
    }

    // Test 7: Take Screenshots
    console.log('📋 Test 7: Taking screenshots...');
    await page.screenshot({ path: 'test-dashboard-screenshot.png', fullPage: true });
    console.log('✅ Screenshot saved as test-dashboard-screenshot.png\n');

    // Test 8: Check for Console Errors
    console.log('📋 Test 8: Checking for console errors...');
    const errorLogs = consoleLogs.filter(log => 
      log.includes('error') || 
      log.includes('Error') || 
      log.includes('failed') ||
      log.includes('Not authenticated')
    );
    
    if (errorLogs.length > 0) {
      console.log('⚠️ Found console messages with errors:');
      errorLogs.forEach(log => console.log('  -', log));
      console.log('');
    } else {
      console.log('✅ No error messages in console\n');
    }

    // Test 9: Test API Endpoints
    console.log('📋 Test 9: Testing API endpoints...');
    
    // Test learning plans API
    const plansResponse = await page.evaluate(async () => {
      const response = await fetch('/api/learning-plans');
      return {
        status: response.status,
        ok: response.ok,
        data: await response.json()
      };
    });
    
    console.log('Learning Plans API:');
    console.log('  Status:', plansResponse.status);
    console.log('  OK:', plansResponse.ok);
    console.log('  Data count:', plansResponse.data?.data?.length || 0);
    
    if (plansResponse.ok) {
      console.log('✅ Learning Plans API working\n');
    } else {
      console.log('❌ Learning Plans API failed\n');
      errors.push('Learning Plans API failed');
    }
    
    // Test patentable ideas API
    const ideasResponse = await page.evaluate(async () => {
      const response = await fetch('/api/patentable-ideas');
      return {
        status: response.status,
        ok: response.ok,
        data: await response.json()
      };
    });
    
    console.log('Patentable Ideas API:');
    console.log('  Status:', ideasResponse.status);
    console.log('  OK:', ideasResponse.ok);
    console.log('  Data count:', ideasResponse.data?.data?.length || 0);
    
    if (ideasResponse.ok) {
      console.log('✅ Patentable Ideas API working\n');
    } else {
      console.log('❌ Patentable Ideas API failed\n');
      errors.push('Patentable Ideas API failed');
    }

    // Final Summary
    console.log('═══════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════\n');
    
    if (errors.length === 0) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('✅ No errors found');
      console.log('✅ Application is working correctly\n');
    } else {
      console.log('❌ TESTS FAILED');
      console.log(`❌ Found ${errors.length} error(s):\n`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      console.log('');
    }
    
    console.log('📸 Screenshot saved: test-dashboard-screenshot.png');
    console.log('🌐 Application URL: http://localhost:3000');
    console.log('');

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.error(error);
  } finally {
    // Keep browser open for 5 seconds to see the result
    console.log('⏳ Keeping browser open for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
    console.log('✅ Browser closed');
  }
}

// Check if puppeteer is installed
async function checkPuppeteer() {
  try {
    require.resolve('puppeteer');
    return true;
  } catch (e) {
    return false;
  }
}

// Main execution
(async () => {
  const hasPuppeteer = await checkPuppeteer();
  
  if (!hasPuppeteer) {
    console.log('❌ Puppeteer is not installed!');
    console.log('📦 Installing puppeteer...');
    console.log('Run: npm install puppeteer');
    console.log('');
    process.exit(1);
  }
  
  await testApplication();
})();
