const puppeteer = require('puppeteer');

async function simpleTest() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      slowMo: 50
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
    console.log('Current URL:', currentUrl);
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if we're on the admin page
    const isAdminPage = currentUrl.includes('/admin');
    console.log('Is admin page:', isAdminPage);
    
    // Try to find tabs using Radix UI classes
    const tabs = await page.$$('.grid-cols-6 button');
    console.log('Found tabs with grid-cols-6 selector:', tabs.length);
    
    // Get tab text content
    if (tabs.length > 0) {
      const tabTexts = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('.grid-cols-6 button'));
        return buttons.map(btn => btn.textContent.trim());
      });
      console.log('Tab texts:', tabTexts);
    }
    
    // Try to find tabs by their content
    const contactTab = await page.$('button:has-text("Contact Management")');
    console.log('Found Contact Management tab:', !!contactTab);
    
    const bulkTab = await page.$('button:has-text("Bulk Operations")');
    console.log('Found Bulk Operations tab:', !!bulkTab);
    
    const userTab = await page.$('button:has-text("User Management")');
    console.log('Found User Management tab:', !!userTab);
    
    const learningTab = await page.$('button:has-text("Learning Plans")');
    console.log('Found Learning Plans tab:', !!learningTab);
    
    const patentTab = await page.$('button:has-text("Patentable Ideas")');
    console.log('Found Patentable Ideas tab:', !!patentTab);
    
    const settingsTab = await page.$('button:has-text("Settings")');
    console.log('Found Settings tab:', !!settingsTab);
    
    // Take screenshot
    await page.screenshot({ path: 'simple-test.png' });
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

simpleTest()
  .then(success => {
    if (success) {
      console.log('✅ Simple test completed!');
      process.exit(0);
    } else {
      console.log('❌ Simple test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Test error:', error);
    process.exit(1);
  });