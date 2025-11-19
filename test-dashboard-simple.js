const puppeteer = require('puppeteer');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 Testing Dashboard Data Display...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  
  // Log console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Database') || text.includes('Supabase') || text.includes('Error') || text.includes('Reading')) {
      console.log('BROWSER:', text);
    }
  });
  
  try {
    // Login
    console.log('1️⃣ Logging in...');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle2' });
    await page.type('#userId', 'admin@actrec.gov.in');
    await page.type('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✓ Logged in\n');
    
    await wait(3000);
    
    // Get page content
    const fullContent = await page.evaluate(() => document.body.innerText);
    console.log('2️⃣ Dashboard loaded. Content sample:');
    console.log(fullContent.substring(0, 1000));
    console.log('\n');
    
    // Find and click tabs
    const tabs = await page.$$('button[role="tab"]');
    const tabNames = await Promise.all(tabs.map(tab => tab.evaluate(el => el.textContent?.trim())));
    console.log('3️⃣ Found tabs:', tabNames, '\n');
    
    // Test each tab
    for (let i = 0; i < tabs.length; i++) {
      console.log(`Testing tab ${i + 1}: ${tabNames[i]}`);
      await tabs[i].click();
      await wait(3000);
      
      const content = await page.evaluate(() => document.body.innerText);
      
      // Check for key indicators
      const hasLoading = content.includes('Loading');
      const hasData = content.match(/\d+\s+(users|contacts|ideas|plans)/i);
      const hasEmpty = content.includes('No ') && content.includes('found');
      
      console.log(`  - Loading: ${hasLoading}`);
      console.log(`  - Has data count: ${hasData ? hasData[0] : 'No'}`);
      console.log(`  - Empty state: ${hasEmpty}`);
      console.log(`  - Content length: ${content.length} chars`);
      
      await page.screenshot({ path: `screenshots/tab-${i + 1}-${tabNames[i]?.replace(/\s+/g, '-')}.png` });
      console.log('');
    }
    
    console.log('✅ Test completed! Check screenshots folder.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'screenshots/error.png' });
  }
  
  console.log('Browser will stay open for 20 seconds...');
  await wait(20000);
  await browser.close();
})();
