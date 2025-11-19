// Test script to verify admin dashboard tabs
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testAdminDashboardTabs() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 50 // Slow down operations to see what's happening
    });
    
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3001/auth/login', { waitUntil: 'networkidle2' });
    
    // Login as admin
    console.log('Logging in as admin...');
    await page.type('#username', 'admin@actrec.gov.in');
    await page.type('#password', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to admin dashboard
    console.log('Waiting for admin dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Verify we're on the admin dashboard
    const currentUrl = page.url();
    if (!currentUrl.includes('/admin')) {
      throw new Error('Not redirected to admin dashboard');
    }
    
    console.log('Successfully logged in as admin');
    
    // Check that all 6 tabs are present
    console.log('Checking for tabs...');
    const tabs = await page.$$('.grid.w-full.grid-cols-6 .tabs-trigger');
    const tabCount = tabs.length;
    
    if (tabCount !== 6) {
      throw new Error(`Expected 6 tabs, found ${tabCount}`);
    }
    
    console.log(`Found ${tabCount} tabs as expected`);
    
    // Get tab labels
    const tabLabels = await page.evaluate(() => {
      const triggers = Array.from(document.querySelectorAll('.grid.w-full.grid-cols-6 .tabs-trigger'));
      return triggers.map(trigger => trigger.textContent.trim());
    });
    
    console.log('Tab labels:', tabLabels);
    
    // Expected tab order
    const expectedTabs = [
      'Contact Management',
      'Bulk Operations',
      'User Management',
      'Learning Plans',
      'Patentable Ideas',
      'Settings'
    ];
    
    // Check if tabs match expected order
    const tabsMatch = expectedTabs.every((expected, index) => 
      tabLabels[index] && tabLabels[index].includes(expected)
    );
    
    if (!tabsMatch) {
      throw new Error(`Tab order doesn't match expected. Found: ${tabLabels.join(', ')}`);
    }
    
    console.log('Tabs are in correct order');
    
    // Test clicking each tab
    for (let i = 0; i < expectedTabs.length; i++) {
      console.log(`Testing tab: ${expectedTabs[i]}`);
      const tab = tabs[i];
      await tab.click();
      
      // Wait a bit for content to load
      await page.waitForTimeout(1000);
      
      console.log(`Successfully clicked ${expectedTabs[i]} tab`);
    }
    
    console.log('All tabs working correctly!');
    
    // Take a screenshot
    await page.screenshot({ path: 'admin-dashboard-tabs-test.png' });
    console.log('Screenshot saved as admin-dashboard-tabs-test.png');
    
    return true;
  } catch (error) {
    console.error('Test failed:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testAdminDashboardTabs()
  .then(success => {
    if (success) {
      console.log('✅ Admin dashboard tabs test passed!');
      process.exit(0);
    } else {
      console.log('❌ Admin dashboard tabs test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test error:', error);
    process.exit(1);
  });