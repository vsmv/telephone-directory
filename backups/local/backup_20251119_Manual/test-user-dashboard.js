// Test script to verify user dashboard functionality
const puppeteer = require('puppeteer');

async function testUserDashboard() {
  console.log('🚀 Starting User Dashboard Test...');

  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    console.log('📱 Navigating to login page...');
    await page.goto('http://localhost:3001/auth/login');

    // Wait for page to load
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    console.log('🔐 Testing Regular User Login...');
    // Test with the user's actual account that has data
    await page.type('input[type="email"]', 'priya.sharma@actrec.gov.in');
    await page.type('input[type="password"]', '@@0vgqUq6WsA');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

    console.log('✅ Login successful, checking dashboard...');

    // Check if we're on the dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Redirected to dashboard successfully');
    } else {
      console.log('❌ Not redirected to dashboard, current URL:', currentUrl);
    }

    // Check for the 4 tabs
    console.log('🔍 Checking for dashboard tabs...');

    const tabs = await page.$$('[role="tab"]');
    console.log(`Found ${tabs.length} tabs`);

    // Check specific tab names
    const tabTexts = await page.$$eval('[role="tab"]', tabs =>
      tabs.map(tab => tab.textContent?.trim())
    );

    console.log('Tab texts found:', tabTexts);

    const expectedTabs = ['Learning Plans', 'Patentable Ideas', 'Search', 'Settings'];
    const missingTabs = expectedTabs.filter(tab =>
      !tabTexts.some(tabText => tabText?.includes(tab))
    );

    if (missingTabs.length === 0) {
      console.log('✅ All 4 tabs are present for regular user!');
    } else {
      console.log('❌ Missing tabs:', missingTabs);
    }

    // Test clicking on each tab
    console.log('🖱️ Testing tab navigation...');

    for (const tabName of expectedTabs) {
      try {
        // Find tab by text content
        const tabs = await page.$$('[role="tab"]');
        let targetTab = null;

        for (const tab of tabs) {
          const text = await tab.evaluate(el => el.textContent?.trim());
          if (text && text.includes(tabName)) {
            targetTab = tab;
            break;
          }
        }

        if (targetTab) {
          await targetTab.click();
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for content to load

          // Check if tab content is visible
          const tabContent = await page.$(`[data-state="active"]`);
          if (tabContent) {
            console.log(`✅ ${tabName} tab is accessible`);

            // For Learning Plans and Patentable Ideas tabs, check if data is displayed
            if (tabName === 'Learning Plans' || tabName === 'Patentable Ideas') {
              // Look for data items in the tab content
              const dataItems = await page.$$('[data-state="active"] .border.rounded-lg.p-4');
              console.log(`📊 ${tabName}: Found ${dataItems.length} data items displayed`);

              if (dataItems.length > 0) {
                // Get the text content of the first item to verify data
                const firstItemText = await dataItems[0].evaluate(el => el.textContent?.trim());
                console.log(`📝 ${tabName} sample data: ${firstItemText?.substring(0, 100)}...`);
              } else {
                console.log(`⚠️ ${tabName}: No data items found in UI (but data exists in database)`);
              }
            }
          } else {
            console.log(`❌ ${tabName} tab content not found`);
          }
        } else {
          console.log(`❌ ${tabName} tab not found`);
        }
      } catch (error) {
        console.log(`❌ Error accessing ${tabName} tab:`, error.message);
      }
    }

    // Test admin user login
    console.log('🔐 Testing Admin User Login...');
    await page.goto('http://localhost:3001/auth/login');

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'admin@actrec.gov.in');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const adminUrl = page.url();
    if (adminUrl.includes('/admin/dashboard')) {
      console.log('✅ Admin correctly redirected to admin dashboard');
    } else {
      console.log('❌ Admin not redirected to admin dashboard, current URL:', adminUrl);
    }

    console.log('🎉 User Dashboard Test Complete!');

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testUserDashboard().catch(console.error);
