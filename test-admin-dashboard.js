const puppeteer = require('puppeteer');
const fs = require('fs');

async function testAdminDashboard() {
  console.log('🚀 Starting admin dashboard test...');
  
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
    
    // Fill in credentials for admin user
    console.log('🔐 Logging in as admin user...');
    await page.type('input[type="email"]', 'admin@actrec.gov.in');
    await page.type('input[type="password"]', 'admin123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    console.log('📤 Login form submitted');
    
    // Wait for navigation
    console.log('⏳ Waiting for redirect...');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 });
    
    // Check the current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      // Check if it's the admin redirect page
      const isAdminRedirectPage = await page.evaluate(() => {
        return document.querySelector('h2.text-2xl.font-bold.text-gray-900.mb-2')?.textContent.includes('Administrator Access');
      });
      
      if (isAdminRedirectPage) {
        console.log('✅ Admin redirect page loaded correctly');
        console.log('📝 Admin should be redirected to admin dashboard');
        
        // Take screenshot
        await page.screenshot({ path: 'admin-redirect-page.png', fullPage: true });
        console.log('📸 Screenshot saved: admin-redirect-page.png');
      } else {
        console.log('✅ Successfully logged in to admin dashboard');
        
        // Wait for the dashboard to fully load
        await page.waitForSelector('div[role="tablist"]', { timeout: 10000 });
        console.log('✅ Admin dashboard loaded');
        
        // Take screenshot
        await page.screenshot({ path: 'admin-dashboard.png', fullPage: true });
        console.log('📸 Screenshot saved: admin-dashboard.png');
      }
    } else {
      console.log('❌ Login failed or redirected incorrectly');
      await page.screenshot({ path: 'admin-login-failed.png', fullPage: true });
      console.log('📸 Screenshot saved: admin-login-failed.png');
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error);
    // Take screenshot of error
    if (browser) {
      const pages = await browser.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({ path: 'admin-error-state.png', fullPage: true });
        console.log('📸 Error screenshot saved: admin-error-state.png');
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log('🏁 Admin test completed');
  }
}

// Run the test
testAdminDashboard().catch(console.error);