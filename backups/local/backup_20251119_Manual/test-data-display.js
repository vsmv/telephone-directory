const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting data display test...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Enable console logging from the page
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  
  // Enable error logging
  page.on('pageerror', error => {
    console.error('PAGE ERROR:', error.message);
  });
  
  // Enable request failure logging
  page.on('requestfailed', request => {
    console.error('REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  try {
    // Navigate to home page
    console.log('📍 Navigating to home page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'screenshots/01-home.png' });
    console.log('✓ Home page loaded\n');
    
    // Navigate to login
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'screenshots/02-login.png' });
    console.log('✓ Login page loaded\n');
    
    // Login as admin
    console.log('🔐 Logging in as admin...');
    await page.type('#userId', 'admin@actrec.gov.in');
    await page.type('#password', 'admin123');
    await page.screenshot({ path: 'screenshots/03-login-filled.png' });
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    await page.screenshot({ path: 'screenshots/04-dashboard.png' });
    console.log('✓ Logged in successfully\n');
    
    // Wait a bit for dashboard to load
    await page.waitForTimeout(3000);
    
    // Get all tab buttons
    console.log('📊 Finding all tabs...');
    const allText = await page.evaluate(() => document.body.innerText);
    console.log('Dashboard text:', allText.substring(0, 1000));
    
    // Try to find tabs by text content
    const tabs = await page.$$('button[role="tab"]');
    console.log(`Found ${tabs.length} tabs\n`);
    
    for (let i = 0; i < tabs.length; i++) {
      const tabText = await tabs[i].evaluate(el => el.textContent);
      console.log(`Tab ${i}: "${tabText}"`);
    }
    console.log('');
    
    // Test Patentable Ideas
    console.log('💡 Testing Patentable Ideas...');
    try {
      // Click the tab by text
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        const ideasTab = tabs.find(tab => tab.textContent.includes('Patentable Ideas'));
        if (ideasTab) ideasTab.click();
      });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/05-patentable-ideas.png' });
      
      // Check for ideas
      const ideasText = await page.evaluate(() => document.body.innerText);
      console.log('  - Page content:', ideasText.substring(0, 1500));
      
      // Check for loading state
      const hasLoading = ideasText.includes('Loading');
      const hasNoIdeas = ideasText.includes('No patentable ideas found');
      const hasIdeas = ideasText.includes('Total Patentable Ideas');
      const hasError = ideasText.includes('Error');
      
      console.log('  - Has loading state:', hasLoading);
      console.log('  - Has "no ideas" message:', hasNoIdeas);
      console.log('  - Has ideas display:', hasIdeas);
      console.log('  - Has error:', hasError);
    } catch (error) {
      console.log('  ⚠️ Error testing Patentable Ideas:', error.message);
    }
    console.log('');
    
    // Test Learning Plans
    console.log('📚 Testing Learning Plans...');
    try {
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        const plansTab = tabs.find(tab => tab.textContent.includes('Learning Plans'));
        if (plansTab) plansTab.click();
      });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/06-learning-plans.png' });
      
      // Check for plans
      const plansText = await page.evaluate(() => document.body.innerText);
      console.log('  - Page content:', plansText.substring(0, 1500));
      
      // Check for loading state
      const hasLoading = plansText.includes('Loading');
      const hasNoPlans = plansText.includes('No learning plans found');
      const hasPlans = plansText.includes('Total Plans');
      const hasError = plansText.includes('Error');
      
      console.log('  - Has loading state:', hasLoading);
      console.log('  - Has "no plans" message:', hasNoPlans);
      console.log('  - Has plans display:', hasPlans);
      console.log('  - Has error:', hasError);
    } catch (error) {
      console.log('  ⚠️ Error testing Learning Plans:', error.message);
    }
    console.log('');
    
    // Test User Management
    console.log('👥 Testing User Management...');
    try {
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        const usersTab = tabs.find(tab => tab.textContent.includes('User Management'));
        if (usersTab) usersTab.click();
      });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/07-user-management.png' });
      
      // Check for users
      const usersText = await page.evaluate(() => document.body.innerText);
      const hasUsers = usersText.includes('System Users');
      console.log('  - User Management visible:', hasUsers);
      console.log('  - Page text sample:', usersText.substring(0, 1000));
    } catch (error) {
      console.log('  ⚠️ Error testing User Management:', error.message);
    }
    console.log('');
    
    // Check network requests
    console.log('🌐 Checking network activity...');
    const requests = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(r => ({
        name: r.name,
        duration: r.duration,
        transferSize: r.transferSize
      }));
    });
    
    const supabaseRequests = requests.filter(r => r.name.includes('supabase'));
    console.log('  - Supabase requests:', supabaseRequests.length);
    supabaseRequests.forEach(req => {
      console.log('    -', req.name);
    });
    
    console.log('\n✅ Test completed! Check screenshots folder for visual results.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/error.png' });
  } finally {
    await browser.close();
  }
})();
