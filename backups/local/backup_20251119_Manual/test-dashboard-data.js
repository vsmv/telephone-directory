const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Testing Dashboard Data Display...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  
  // Log console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', error => console.error('ERROR:', error.message));
  
  try {
    // 1. Go to login
    console.log('1️⃣ Navigating to login...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'screenshots/01-login.png' });
    
    // 2. Login
    console.log('2️⃣ Logging in as admin@actrec.gov.in...');
    await page.type('#userId', 'admin@actrec.gov.in');
    await page.type('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'screenshots/02-dashboard.png' });
    console.log('✓ Logged in\n');
    
    await page.waitForTimeout(2000);
    
    // 3. Get all tabs
    console.log('3️⃣ Finding dashboard tabs...');
    const tabs = await page.$$('button[role="tab"]');
    const tabNames = await Promise.all(
      tabs.map(tab => tab.evaluate(el => el.textContent?.trim()))
    );
    console.log('Found tabs:', tabNames);
    console.log('');
    
    // 4. Test Patentable Ideas
    console.log('4️⃣ Testing Patentable Ideas tab...');
    const ideasTabIndex = tabNames.findIndex(name => name && name.includes('Patentable'));
    if (ideasTabIndex >= 0) {
      await tabs[ideasTabIndex].click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/03-patentable-ideas.png' });
      
      const content = await page.evaluate(() => document.body.innerText);
      console.log('Content includes "Total Patentable Ideas":', content.includes('Total Patentable Ideas'));
      console.log('Content includes "Loading":', content.includes('Loading'));
      console.log('Content includes "No patentable ideas":', content.includes('No patentable ideas'));
      console.log('First 500 chars:', content.substring(0, 500));
    } else {
      console.log('⚠️ Patentable Ideas tab not found');
    }
    console.log('');
    
    // 5. Test Learning Plans
    console.log('5️⃣ Testing Learning Plans tab...');
    const plansTabIndex = tabNames.findIndex(name => name && name.includes('Learning'));
    if (plansTabIndex >= 0) {
      await tabs[plansTabIndex].click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'screenshots/04-learning-plans.png' });
      
      const content = await page.evaluate(() => document.body.innerText);
      console.log('Content includes "Total Plans":', content.includes('Total Plans'));
      console.log('Content includes "Loading":', content.includes('Loading'));
      console.log('Content includes "No learning plans":', content.includes('No learning plans'));
      console.log('First 500 chars:', content.substring(0, 500));
    } else {
      console.log('⚠️ Learning Plans tab not found');
    }
    console.log('');
    
    // 6. Test User Management
    console.log('6️⃣ Testing User Management tab...');
    const usersTabIndex = tabNames.findIndex(name => name && name.includes('User'));
    if (usersTabIndex >= 0) {
      await tabs[usersTabIndex].click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'screenshots/05-user-management.png' });
      
      const content = await page.evaluate(() => document.body.innerText);
      console.log('Content includes "System Users":', content.includes('System Users'));
      console.log('Content includes users:', content.includes('admin@actrec.gov.in'));
      console.log('First 500 chars:', content.substring(0, 500));
    } else {
      console.log('⚠️ User Management tab not found');
    }
    console.log('');
    
    // 7. Check Supabase connection
    console.log('7️⃣ Checking Supabase connection...');
    const supabaseUrl = await page.evaluate(() => {
      return window.localStorage.getItem('supabase.auth.token') ? 'Connected' : 'Not connected';
    });
    console.log('Supabase auth:', supabaseUrl);
    
    console.log('\n✅ Test completed! Check screenshots folder.');
    console.log('\n📝 Summary:');
    console.log('- If you see "Loading" stuck, there might be an API issue');
    console.log('- If you see "No ... found", the data fetch returned empty');
    console.log('- Check browser console for actual errors');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'screenshots/error.png' });
  }
  
  // Keep browser open for manual inspection
  console.log('\n⏸️  Browser will stay open for 30 seconds for inspection...');
  await page.waitForTimeout(30000);
  await browser.close();
})();
