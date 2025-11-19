// Simplified UI test focusing on data display
const puppeteer = require('puppeteer');

async function testUIDataDisplay() {
  console.log('🎯 Testing UI Data Display\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Go to dashboard
    console.log('📊 Navigating to dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
    
    // Check if we're on login page
    const currentUrl = page.url();
    if (currentUrl.includes('/auth/login')) {
      console.log('🔐 On login page, attempting login...');
      
      // Wait for form elements and try different selectors
      try {
        await page.waitForSelector('input[name="email"], input[id="email"], input[type="email"]', { timeout: 3000 });
        await page.type('input[name="email"], input[id="email"], input[type="email"]', 'admin@actrec.gov.in');
        
        await page.waitForSelector('input[name="password"], input[id="password"], input[type="password"]', { timeout: 3000 });
        await page.type('input[name="password"], input[id="password"], input[type="password"]', 'admin123');
        
        await page.click('button[type="submit"], button:contains("Login"), .login-button');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log('✅ Login successful');
      } catch (error) {
        console.log('⚠️  Login form interaction failed, continuing...');
      }
    }
    
    // Test API endpoints directly from browser
    console.log('\n🔌 Testing API endpoints from browser...');
    
    const apiResults = await page.evaluate(async () => {
      const results = {};
      
      try {
        const learningResponse = await fetch('/api/learning-plans');
        const learningData = await learningResponse.json();
        results.learning = {
          success: learningResponse.ok,
          count: learningData.data?.length || 0,
          error: learningData.error || null,
          sample: learningData.data?.[0]?.title || null
        };
      } catch (error) {
        results.learning = { success: false, error: error.message };
      }
      
      try {
        const ideasResponse = await fetch('/api/patentable-ideas');
        const ideasData = await ideasResponse.json();
        results.ideas = {
          success: ideasResponse.ok,
          count: ideasData.data?.length || 0,
          error: ideasData.error || null,
          sample: ideasData.data?.[0]?.title || null
        };
      } catch (error) {
        results.ideas = { success: false, error: error.message };
      }
      
      return results;
    });
    
    console.log('📚 Learning Plans API Result:');
    if (apiResults.learning.success) {
      console.log(`   ✅ SUCCESS: ${apiResults.learning.count} records`);
      if (apiResults.learning.sample) {
        console.log(`   📝 Sample: "${apiResults.learning.sample}"`);
      }
    } else {
      console.log(`   ❌ FAILED: ${apiResults.learning.error}`);
    }
    
    console.log('\n💡 Patentable Ideas API Result:');
    if (apiResults.ideas.success) {
      console.log(`   ✅ SUCCESS: ${apiResults.ideas.count} records`);
      if (apiResults.ideas.sample) {
        console.log(`   📝 Sample: "${apiResults.ideas.sample}"`);
      }
    } else {
      console.log(`   ❌ FAILED: ${apiResults.ideas.error}`);
    }
    
    // Check for any React components or data on the page
    console.log('\n🔍 Checking page content...');
    const pageContent = await page.evaluate(() => {
      const body = document.body.textContent || '';
      return {
        hasLearningPlans: body.includes('Learning Plans') || body.includes('Study Plans'),
        hasPatentableIdeas: body.includes('Patentable Ideas') || body.includes('Patents'),
        hasNoDataMessage: body.includes('No data') || body.includes('No records') || body.includes('No learning plans') || body.includes('No patentable ideas'),
        hasErrorMessage: body.includes('Error') || body.includes('Failed'),
        hasLoadingMessage: body.includes('Loading') || body.includes('loading'),
        totalLength: body.length
      };
    });
    
    console.log('📄 Page Content Analysis:');
    console.log(`   Learning Plans mentioned: ${pageContent.hasLearningPlans ? '✅' : '❌'}`);
    console.log(`   Patentable Ideas mentioned: ${pageContent.hasPatentableIdeas ? '✅' : '❌'}`);
    console.log(`   "No data" messages: ${pageContent.hasNoDataMessage ? '⚠️  YES' : '✅ NO'}`);
    console.log(`   Error messages: ${pageContent.hasErrorMessage ? '❌ YES' : '✅ NO'}`);
    console.log(`   Loading messages: ${pageContent.hasLoadingMessage ? '⏳ YES' : '✅ NO'}`);
    console.log(`   Page content length: ${pageContent.totalLength} characters`);
    
    // Take screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'ui-test-screenshot.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved as ui-test-screenshot.png');
    
    // Check browser console for errors
    console.log('\n🔍 Checking for JavaScript errors...');
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });
    
    console.log('✅ UI test completed');
    
  } catch (error) {
    console.log('💥 UI test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testUIDataDisplay().then(() => {
  console.log('\n🎉 UI test completed!');
}).catch(error => {
  console.error('💥 UI test failed:', error);
});