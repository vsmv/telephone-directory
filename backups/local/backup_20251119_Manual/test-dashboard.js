const puppeteer = require('puppeteer');
const fs = require('fs');

async function testDashboard() {
  console.log('🚀 Starting dashboard test...');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: true, // Run in headless mode for automated testing
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to a large size
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable console logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    page.on('response', response => {
      if (!response.ok()) {
        console.log('HTTP ERROR:', response.status(), response.url());
      }
    });
    
    // Navigate to the login page
    console.log('🌐 Navigating to login page...');
    await page.goto('http://localhost:3001/auth/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for the page to load
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    console.log('✅ Login page loaded');
    
    // Fill in credentials for regular user
    console.log('🔐 Logging in as regular user...');
    await page.type('input[type="email"]', 'priya.sharma@actrec.gov.in');
    await page.type('input[type="password"]', 'password@@0vgqUq6WsA');
    
    // Submit the form
    await page.click('button[type="submit"]');
    console.log('📤 Login form submitted');
    
    // Wait for navigation to dashboard
    console.log('⏳ Waiting for dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
    
    // Check if we're on the dashboard
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully logged in to dashboard');
      
      // Wait for the dashboard to fully load
      await page.waitForSelector('div[role="tablist"]', { timeout: 10000 });
      console.log('✅ Dashboard loaded');
      
      // Click on Learning Plans tab
      console.log('📚 Navigating to Learning Plans...');
      await page.click('button[role="tab"]:nth-child(1)');
      
      // Wait for content to load (using waitForTimeout replacement)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if learning plans are displayed
      const learningPlansCount = await page.evaluate(() => {
        const elements = document.querySelectorAll('div.border.rounded-lg.p-4');
        return elements.length;
      });
      console.log(`📊 Learning Plans found: ${learningPlansCount}`);
      
      // Take screenshot
      await page.screenshot({ path: 'dashboard-learning-plans.png', fullPage: true });
      console.log('📸 Screenshot saved: dashboard-learning-plans.png');
      
      // Click on Patentable Ideas tab
      console.log('💡 Navigating to Patentable Ideas...');
      await page.click('button[role="tab"]:nth-child(2)');
      
      // Wait for content to load (using waitForTimeout replacement)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if patentable ideas are displayed
      const patentableIdeasCount = await page.evaluate(() => {
        const elements = document.querySelectorAll('div.border.rounded-lg.p-4');
        return elements.length;
      });
      console.log(`📊 Patentable Ideas found: ${patentableIdeasCount}`);
      
      // Take screenshot
      await page.screenshot({ path: 'dashboard-patentable-ideas.png', fullPage: true });
      console.log('📸 Screenshot saved: dashboard-patentable-ideas.png');
      
      // Click on Search tab
      console.log('🔍 Navigating to Search...');
      await page.click('button[role="tab"]:nth-child(3)');
      
      // Wait for content to load (using waitForTimeout replacement)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot
      await page.screenshot({ path: 'dashboard-search.png', fullPage: true });
      console.log('📸 Screenshot saved: dashboard-search.png');
      
    } else {
      console.log('❌ Login failed or redirected incorrectly');
      await page.screenshot({ path: 'login-failed.png', fullPage: true });
      console.log('📸 Screenshot saved: login-failed.png');
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
    // Take screenshot of error
    if (browser) {
      const pages = await browser.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({ path: 'error-state.png', fullPage: true });
        console.log('📸 Error screenshot saved: error-state.png');
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log('🏁 Test completed');
  }
}

// Run the test
testDashboard().catch(console.error);