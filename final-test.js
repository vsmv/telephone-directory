const puppeteer = require('puppeteer');

async function finalTest() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true // Run in headless mode for faster testing
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3001/auth/login', { waitUntil: 'networkidle2' });
    
    // Login as admin
    console.log('Logging in as admin...');
    await page.type('#username', 'admin@actrec.gov.in');
    await page.type('#password', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    console.log('Waiting for admin dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Check URL
    const currentUrl = page.url();
    if (!currentUrl.includes('/admin')) {
      throw new Error('Not redirected to admin dashboard');
    }
    
    console.log('✅ Successfully logged in as admin');
    
    // Wait for the tabs to be loaded
    await page.waitForSelector('.grid.w-full.grid-cols-6', { timeout: 5000 });
    
    // Verify we have 6 tabs
    const tabs = await page.$$('.grid.w-full.grid-cols-6 button');
    if (tabs.length !== 6) {
      throw new Error(`Expected 6 tabs, found ${tabs.length}`);
    }
    
    console.log('✅ Found 6 tabs as expected');
    
    // Get tab labels
    const tabTexts = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.grid.w-full.grid-cols-6 button'));
      return buttons.map(btn => {
        // Get the visible text (first span for full text on larger screens)
        const visibleSpans = btn.querySelectorAll('span:not(.sm\\:hidden)');
        if (visibleSpans.length > 0) {
          return visibleSpans[0].textContent.trim();
        }
        // Fallback to button text
        return btn.textContent.trim();
      });
    });
    
    console.log('Tab labels:', tabTexts);
    
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
      tabTexts[index] && tabTexts[index].includes(expected)
    );
    
    if (!tabsMatch) {
      throw new Error(`Tab order doesn't match expected. Found: ${tabTexts.join(', ')}`);
    }
    
    console.log('✅ Tabs are in correct order');
    
    // Test clicking each tab
    for (let i = 0; i < tabs.length; i++) {
      console.log(`Testing tab: ${expectedTabs[i]}`);
      await tabs[i].click();
      
      // Wait a bit for content to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`✅ Successfully clicked ${expectedTabs[i]} tab`);
    }
    
    console.log('✅ All tabs working correctly!');
    
    // Take a screenshot
    await page.screenshot({ path: 'final-test-result.png' });
    console.log('📸 Screenshot saved as final-test-result.png');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
finalTest()
  .then(success => {
    if (success) {
      console.log('🎉 Final test passed! Admin dashboard is working correctly.');
      process.exit(0);
    } else {
      console.log('💥 Final test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test error:', error);
    process.exit(1);
  });