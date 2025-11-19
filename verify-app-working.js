// Direct verification that the app is working
const puppeteer = require('puppeteer');

async function verifyAppWorking() {
  console.log('🔍 Direct Application Verification\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1280, height: 900 }
    });
    
    const page = await browser.newPage();
    
    // Test 1: Can we load the dashboard?
    console.log('1️⃣ Testing dashboard load...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0', timeout: 10000 });
    
    const title = await page.title();
    console.log('   Page title:', title);
    
    // Test 2: Check if data is in the page
    console.log('\n2️⃣ Checking for data in page...');
    const content = await page.content();
    
    const checks = {
      hasLearningPlans: content.includes('Learning Plans') || content.includes('Study Plans'),
      hasPatentableIdeas: content.includes('Patentable Ideas') || content.includes('Patents'),
      hasContacts: content.includes('Contact Management') || content.includes('Contacts'),
      hasData: content.includes('Microbiology') || content.includes('AI-Powered'),
      hasDebugInfo: content.includes('Debug:') || content.includes('API Status')
    };
    
    console.log('   Page contains:');
    console.log('   - Learning Plans section:', checks.hasLearningPlans ? '✅' : '❌');
    console.log('   - Patentable Ideas section:', checks.hasPatentableIdeas ? '✅' : '❌');
    console.log('   - Contacts section:', checks.hasContacts ? '✅' : '❌');
    console.log('   - Actual data:', checks.hasData ? '✅' : '❌');
    console.log('   - Debug info:', checks.hasDebugInfo ? '✅' : '❌');
    
    // Test 3: Check API calls from browser
    console.log('\n3️⃣ Testing API calls from browser console...');
    
    const apiResults = await page.evaluate(async () => {
      const results = {};
      
      try {
        const plansRes = await fetch('/api/learning-plans');
        const plansData = await plansRes.json();
        results.learningPlans = {
          status: plansRes.status,
          count: plansData.data?.length || 0,
          working: plansRes.ok && plansData.data?.length > 0
        };
      } catch (e) {
        results.learningPlans = { error: e.message };
      }
      
      try {
        const ideasRes = await fetch('/api/patentable-ideas');
        const ideasData = await ideasRes.json();
        results.patentableIdeas = {
          status: ideasRes.status,
          count: ideasData.data?.length || 0,
          working: ideasRes.ok && ideasData.data?.length > 0
        };
      } catch (e) {
        results.patentableIdeas = { error: e.message };
      }
      
      try {
        const contactsRes = await fetch('/api/contacts');
        const contactsData = await contactsRes.json();
        results.contacts = {
          status: contactsRes.status,
          count: contactsData.data?.length || 0,
          working: contactsRes.ok && contactsData.data?.length > 0
        };
      } catch (e) {
        results.contacts = { error: e.message };
      }
      
      return results;
    });
    
    console.log('   API Results:');
    console.log('   - Learning Plans API:', apiResults.learningPlans.working ? `✅ ${apiResults.learningPlans.count} records` : '❌ Failed');
    console.log('   - Patentable Ideas API:', apiResults.patentableIdeas.working ? `✅ ${apiResults.patentableIdeas.count} records` : '❌ Failed');
    console.log('   - Contacts API:', apiResults.contacts.working ? `✅ ${apiResults.contacts.count} records` : '❌ Failed');
    
    // Test 4: Take screenshot
    console.log('\n4️⃣ Taking screenshot...');
    await page.screenshot({ path: 'app-verification.png', fullPage: true });
    console.log('   ✅ Screenshot saved as app-verification.png');
    
    // Test 5: Check for errors in console
    console.log('\n5️⃣ Checking browser console for errors...');
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(3000);
    
    const errors = logs.filter(log => log.toLowerCase().includes('error'));
    if (errors.length > 0) {
      console.log('   ⚠️ Found errors:', errors.length);
      errors.slice(0, 3).forEach(err => console.log('     -', err));
    } else {
      console.log('   ✅ No errors in console');
    }
    
    // Final verdict
    console.log('\n' + '='.repeat(60));
    console.log('VERIFICATION RESULTS');
    console.log('='.repeat(60));
    
    const allWorking = 
      apiResults.learningPlans.working &&
      apiResults.patentableIdeas.working &&
      apiResults.contacts.working;
    
    if (allWorking) {
      console.log('\n✅ APPLICATION IS WORKING!');
      console.log('\nAll APIs are functional:');
      console.log(`   - ${apiResults.contacts.count} contacts`);
      console.log(`   - ${apiResults.learningPlans.count} learning plans`);
      console.log(`   - ${apiResults.patentableIdeas.count} patentable ideas`);
      console.log('\n✅ Data is being fetched and should be displayed');
      console.log('✅ Check the screenshot to see the actual UI');
    } else {
      console.log('\n❌ SOME APIS NOT WORKING');
      console.log('Check the API results above for details');
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Keep browser open for 10 seconds so you can see it
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    console.log('   (You can manually check the UI now)');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.log('\n💥 Verification error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

verifyAppWorking();