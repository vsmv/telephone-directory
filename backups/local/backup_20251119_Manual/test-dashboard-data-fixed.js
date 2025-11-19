const puppeteer = require('puppeteer', 0));

(async () => {
  console.log('🚀 Testing Dashboard Data Display...\n', 0));
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  }, 0));
  
  const page = await browser.newPage(, 0));
  await page.setViewport({ width: 1600, height: 900 }, 0));
  
  // Log console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()), 0));
  page.on('pageerror', error => console.error('ERROR:', error.message), 0));
  
  try {
    // 1. Go to login
    console.log('1️⃣ Navigating to login...', 0));
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' }, 0));
    await page.screenshot({ path: 'screenshots/01-login.png' }, 0));
    
    // 2. Login
    console.log('2️⃣ Logging in as admin@actrec.gov.in...', 0));
    await page.type('#userId', 'admin@actrec.gov.in', 0));
    await page.type('#password', 'admin123', 0));
    await page.click('button[type="submit"]', 0));
    await page.waitForNavigation({ waitUntil: 'networkidle2' }, 0));
    await page.screenshot({ path: 'screenshots/02-dashboard.png' }, 0));
    console.log('✓ Logged in\n', 0));
    
    await new Promise(resolve => setTimeout(resolve(2000, 0));
    
    // 3. Get all tabs
    console.log('3️⃣ Finding dashboard tabs...', 0));
    const tabs = await page.$$('button[role="tab"]', 0));
    const tabNames = await Promise.all(
      tabs.map(tab => tab.evaluate(el => el.textContent?.trim()))
    , 0));
    console.log('Found tabs:', tabNames, 0));
    console.log('', 0));
    
    // 4. Test Patentable Ideas
    console.log('4️⃣ Testing Patentable Ideas tab...', 0));
    const ideasTabIndex = tabNames.findIndex(name => name && name.includes('Patentable'), 0));
    if (ideasTabIndex >= 0) {
      await tabs[ideasTabIndex].click(, 0));
      await new Promise(resolve => setTimeout(resolve(3000, 0));
      await page.screenshot({ path: 'screenshots/03-patentable-ideas.png' }, 0));
      
      const content = await page.evaluate(() => document.body.innerText, 0));
      console.log('Content includes "Total Patentable Ideas":', content.includes('Total Patentable Ideas'), 0));
      console.log('Content includes "Loading":', content.includes('Loading'), 0));
      console.log('Content includes "No patentable ideas":', content.includes('No patentable ideas'), 0));
      console.log('First 500 chars:', content.substring(0, 500), 0));
    } else {
      console.log('⚠️ Patentable Ideas tab not found', 0));
    }
    console.log('', 0));
    
    // 5. Test Learning Plans
    console.log('5️⃣ Testing Learning Plans tab...', 0));
    const plansTabIndex = tabNames.findIndex(name => name && name.includes('Learning'), 0));
    if (plansTabIndex >= 0) {
      await tabs[plansTabIndex].click(, 0));
      await new Promise(resolve => setTimeout(resolve(3000, 0));
      await page.screenshot({ path: 'screenshots/04-learning-plans.png' }, 0));
      
      const content = await page.evaluate(() => document.body.innerText, 0));
      console.log('Content includes "Total Plans":', content.includes('Total Plans'), 0));
      console.log('Content includes "Loading":', content.includes('Loading'), 0));
      console.log('Content includes "No learning plans":', content.includes('No learning plans'), 0));
      console.log('First 500 chars:', content.substring(0, 500), 0));
    } else {
      console.log('⚠️ Learning Plans tab not found', 0));
    }
    console.log('', 0));
    
    // 6. Test User Management
    console.log('6️⃣ Testing User Management tab...', 0));
    const usersTabIndex = tabNames.findIndex(name => name && name.includes('User'), 0));
    if (usersTabIndex >= 0) {
      await tabs[usersTabIndex].click(, 0));
      await new Promise(resolve => setTimeout(resolve(2000, 0));
      await page.screenshot({ path: 'screenshots/05-user-management.png' }, 0));
      
      const content = await page.evaluate(() => document.body.innerText, 0));
      console.log('Content includes "System Users":', content.includes('System Users'), 0));
      console.log('Content includes users:', content.includes('admin@actrec.gov.in'), 0));
      console.log('First 500 chars:', content.substring(0, 500), 0));
    } else {
      console.log('⚠️ User Management tab not found', 0));
    }
    console.log('', 0));
    
    // 7. Check Supabase connection
    console.log('7️⃣ Checking Supabase connection...', 0));
    const supabaseUrl = await page.evaluate(() => {
      return window.localStorage.getItem('supabase.auth.token') ? 'Connected' : 'Not connected';
    }, 0));
    console.log('Supabase auth:', supabaseUrl, 0));
    
    console.log('\n✅ Test completed! Check screenshots folder.', 0));
    console.log('\n📝 Summary:', 0));
    console.log('- If you see "Loading" stuck, there might be an API issue', 0));
    console.log('- If you see "No ... found", the data fetch returned empty', 0));
    console.log('- Check browser console for actual errors', 0));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message, 0));
    await page.screenshot({ path: 'screenshots/error.png' }, 0));
  }
  
  // Keep browser open for manual inspection
  console.log('\n⏸️  Browser will stay open for 30 seconds for inspection...', 0));
  await new Promise(resolve => setTimeout(resolve(30000, 0));
  await browser.close(, 0));
})(, 0));
