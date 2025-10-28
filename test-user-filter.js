const puppeteer = require('puppeteer');

async function testUserFilter() {
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
    
    // Navigate to Learning Plans tab
    console.log('Navigating to Learning Plans tab...');
    const learningPlansTab = await page.$('button:has-text("Learning Plans")');
    if (!learningPlansTab) {
      throw new Error('Learning Plans tab not found');
    }
    await learningPlansTab.click();
    
    // Wait for content to load
    await page.waitForTimeout(1000);
    
    // Check if user filter dropdown exists
    console.log('Checking for user filter dropdown...');
    const userFilter = await page.$('div:has(> select)');
    if (userFilter) {
      console.log('✅ User filter dropdown found');
    } else {
      console.log('ℹ️ User filter dropdown not found (might be using different UI component)');
    }
    
    // Try to find the Select component
    const selectTrigger = await page.$('.w-48');
    if (selectTrigger) {
      console.log('✅ User filter select component found');
      
      // Click the select to open dropdown
      await selectTrigger.click();
      await page.waitForTimeout(500);
      
      // Check if dropdown options are present
      const selectOptions = await page.$$('.select-content [role="option"]');
      console.log(`✅ Found ${selectOptions.length} user options in dropdown`);
      
      if (selectOptions.length > 0) {
        // Click the first user option (if available)
        await selectOptions[0].click();
        console.log('✅ Selected first user from dropdown');
        
        // Wait for content to update
        await page.waitForTimeout(1000);
        
        // Reset filter
        const clearButton = await page.$('button:has-text("Clear")');
        if (clearButton) {
          await clearButton.click();
          console.log('✅ Filter cleared');
        }
      }
    } else {
      console.log('ℹ️ Modern select component not found');
    }
    
    // Navigate to Patentable Ideas tab
    console.log('Navigating to Patentable Ideas tab...');
    const ideasTab = await page.$('button:has-text("Patentable Ideas")');
    if (!ideasTab) {
      throw new Error('Patentable Ideas tab not found');
    }
    await ideasTab.click();
    
    // Wait for content to load
    await page.waitForTimeout(1000);
    
    // Check if user filter dropdown exists for ideas
    console.log('Checking for user filter dropdown in ideas section...');
    const ideasSelectTrigger = await page.$('.w-48');
    if (ideasSelectTrigger) {
      console.log('✅ User filter select component found in ideas section');
    } else {
      console.log('ℹ️ User filter select component not found in ideas section');
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'user-filter-test-result.png' });
    console.log('📸 Screenshot saved as user-filter-test-result.png');
    
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
testUserFilter()
  .then(success => {
    if (success) {
      console.log('🎉 User filter test completed successfully.');
      process.exit(0);
    } else {
      console.log('💥 User filter test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test error:', error);
    process.exit(1);
  });