/**
 * Standalone Puppeteer Test Script
 * Run this directly with: node run-comprehensive-tests.js
 * Make sure dev server is running on port 3000 first
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@actrec.gov.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Test data
const testUser = {
  email: `testuser${Date.now()}@actrec.gov.in`,
  password: 'TestPass@123'
};

const testIdea = {
  title: `Test Patent Idea ${Date.now()}`,
  description: 'This is a test patentable idea for automated testing',
  category: 'Software/Algorithm'
};

const testPlan = {
  title: `Test Learning Plan ${Date.now()}`,
  description: 'This is a test learning plan for automated testing',
  category: 'Technical Skills'
};

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Helper to take screenshot
async function takeScreenshot(page, name) {
  try {
    const filename = `test-${name}-${Date.now()}.png`;
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, filename),
      fullPage: true 
    });
    console.log(`  📸 Screenshot saved: ${filename}`);
  } catch (error) {
    console.error('  ❌ Failed to take screenshot:', error.message);
  }
}

// Helper to wait
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test Results Tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(name, passed, message = '') {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`  ✅ ${name}`);
  } else {
    results.failed++;
    console.log(`  ❌ ${name}: ${message}`);
  }
  results.tests.push({ name, passed, message });
}

async function runTests() {
  console.log('\n🚀 Starting Comprehensive E2E Tests...\n');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  console.log(`👤 Admin Email: ${ADMIN_EMAIL}\n`);

  let browser;
  let page;

  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
      slowMo: 100 // Slow down for visibility
    });
    
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('✅ Browser launched\n');

    // ========================================
    // TEST 1: Admin Login
    // ========================================
    console.log('🔐 TEST GROUP: Authentication');
    try {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
      await wait(2000);
      await takeScreenshot(page, 'initial-page');
      
      // Check if already redirected to home or dashboard
      const currentUrl = page.url();
      console.log(`  📍 Current URL: ${currentUrl}`);
      
      // If on home page, look for login button
      if (currentUrl.includes('/home')) {
        const loginBtn = await page.$('button:has-text("Login"), a[href="/"]');
        if (loginBtn) {
          await loginBtn.click();
          await wait(2000);
        }
      }
      
      // Now try to find email input
      await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
      await page.type('input[type="email"], input[name="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"], input[name="password"]', ADMIN_PASSWORD);
      await takeScreenshot(page, 'login-filled');
      
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1', { timeout: 15000 });
      await wait(2000);
      await takeScreenshot(page, 'dashboard-loaded');
      
      const hasAdminBadge = await page.evaluate(() => {
        return document.body.innerText.includes('ADMIN');
      });
      
      recordTest('Admin Login', hasAdminBadge, hasAdminBadge ? '' : 'Admin badge not found');
    } catch (error) {
      recordTest('Admin Login', false, error.message);
    }

    // ========================================
    // TEST 2: User Management - Single User Creation
    // ========================================
    console.log('\n👥 TEST GROUP: User Management - Single Operations');
    try {
      // Navigate to User Management
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const userTab = tabs.find(tab => tab.textContent.includes('User Management'));
        if (userTab) userTab.click();
      });
      await wait(2000);
      await takeScreenshot(page, 'user-management');
      
      // Create user
      const emailInput = await page.$('input[placeholder*="email"], input[type="email"]');
      const passwordInput = await page.$('input[placeholder*="password"], input[type="password"]');
      
      if (emailInput && passwordInput) {
        await emailInput.click({ clickCount: 3 });
        await emailInput.type(testUser.email);
        await passwordInput.click({ clickCount: 3 });
        await passwordInput.type(testUser.password);
        
        await wait(500);
        
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const createBtn = buttons.find(btn => 
            btn.textContent.includes('Create User') || 
            btn.textContent.includes('Add User')
          );
          if (createBtn) createBtn.click();
        });
        
        await wait(3000);
        await takeScreenshot(page, 'user-created');
        
        const userCreated = await page.evaluate((email) => {
          return document.body.innerText.includes(email);
        }, testUser.email);
        
        recordTest('Single User Creation', userCreated, userCreated ? '' : 'User not found in list');
      } else {
        recordTest('Single User Creation', false, 'Input fields not found');
      }
    } catch (error) {
      recordTest('Single User Creation', false, error.message);
    }

    // ========================================
    // TEST 3: Select All in User Management
    // ========================================
    try {
      await wait(1000);
      
      const selectAllClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const selectAllBtn = buttons.find(btn => btn.textContent.includes('Select All'));
        if (selectAllBtn) {
          selectAllBtn.click();
          return true;
        }
        return false;
      });
      
      await wait(1000);
      await takeScreenshot(page, 'users-selected-all');
      
      recordTest('Select All Users', selectAllClicked, selectAllClicked ? '' : 'Select All button not found');
    } catch (error) {
      recordTest('Select All Users', false, error.message);
    }

    // ========================================
    // TEST 4: Bulk Role Change
    // ========================================
    try {
      const bulkRoleExists = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => 
          btn.textContent.includes('Change Role') ||
          btn.textContent.includes('Bulk')
        );
      });
      
      recordTest('Bulk Role Change Available', bulkRoleExists, bulkRoleExists ? '' : 'Bulk role change button not found');
    } catch (error) {
      recordTest('Bulk Role Change Available', false, error.message);
    }

    // ========================================
    // TEST 5: Bulk Password Reset
    // ========================================
    try {
      const bulkPasswordExists = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => 
          btn.textContent.includes('Reset') &&
          btn.textContent.includes('Password')
        );
      });
      
      recordTest('Bulk Password Reset Available', bulkPasswordExists, bulkPasswordExists ? '' : 'Bulk password reset button not found');
    } catch (error) {
      recordTest('Bulk Password Reset Available', false, error.message);
    }

    // ========================================
    // TEST 6: Patentable Ideas - Add Idea
    // ========================================
    console.log('\n💡 TEST GROUP: Patentable Ideas');
    try {
      // Navigate to Patentable Ideas
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const patentTab = tabs.find(tab => tab.textContent.includes('Patentable Ideas'));
        if (patentTab) patentTab.click();
      });
      await wait(2000);
      await takeScreenshot(page, 'patents-tab');
      
      // Fill idea form
      await page.waitForSelector('input[placeholder*="title"], input[id*="title"]', { timeout: 5000 });
      
      const titleInput = await page.$('input[placeholder*="title"], input[id*="title"]');
      const descInput = await page.$('textarea[placeholder*="description"], textarea[id*="description"]');
      
      if (titleInput && descInput) {
        await titleInput.type(testIdea.title);
        await descInput.type(testIdea.description);
        
        // Select category
        await page.evaluate((category) => {
          const selects = Array.from(document.querySelectorAll('select, [role="combobox"]'));
          for (const select of selects) {
            if (select.closest('div')?.textContent.includes('Category')) {
              if (select.tagName === 'SELECT') {
                select.value = category;
                select.dispatchEvent(new Event('change', { bubbles: true }));
              } else {
                select.click();
              }
              break;
            }
          }
        }, testIdea.category);
        
        await wait(500);
        
        await page.evaluate((category) => {
          const options = Array.from(document.querySelectorAll('[role="option"]'));
          const option = options.find(opt => opt.textContent.includes(category));
          if (option) option.click();
        }, testIdea.category);
        
        await wait(500);
        
        // Click Add button
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const addBtn = buttons.find(btn => 
            btn.textContent.includes('Add Idea') || 
            (btn.textContent.includes('Add') && !btn.textContent.includes('User'))
          );
          if (addBtn) addBtn.click();
        });
        
        await wait(3000);
        await takeScreenshot(page, 'patent-idea-added');
        
        const ideaCreated = await page.evaluate((title) => {
          return document.body.innerText.includes(title);
        }, testIdea.title);
        
        recordTest('Add Patentable Idea', ideaCreated, ideaCreated ? '' : 'Idea not found in list');
      } else {
        recordTest('Add Patentable Idea', false, 'Form inputs not found');
      }
    } catch (error) {
      recordTest('Add Patentable Idea', false, error.message);
    }

    // ========================================
    // TEST 7: Edit Patentable Idea
    // ========================================
    try {
      await wait(1000);
      
      const editClicked = await page.evaluate((title) => {
        const cards = Array.from(document.querySelectorAll('[class*="Card"]'));
        const ideaCard = cards.find(card => card.textContent.includes(title));
        
        if (ideaCard) {
          const buttons = ideaCard.querySelectorAll('button');
          const editBtn = Array.from(buttons).find(btn => 
            btn.querySelector('svg') && btn.getAttribute('class')?.includes('outline')
          );
          if (editBtn) {
            editBtn.click();
            return true;
          }
        }
        return false;
      }, testIdea.title);
      
      if (editClicked) {
        await wait(1000);
        
        const descInput = await page.$('textarea:focus, textarea[value*="test"]');
        if (descInput) {
          await descInput.click({ clickCount: 3 });
          await descInput.type(' - MODIFIED');
          
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const saveBtn = buttons.find(btn => btn.textContent.includes('Save'));
            if (saveBtn) saveBtn.click();
          });
          
          await wait(2000);
          await takeScreenshot(page, 'patent-idea-edited');
        }
      }
      
      recordTest('Edit Patentable Idea', editClicked, editClicked ? '' : 'Edit button not found');
    } catch (error) {
      recordTest('Edit Patentable Idea', false, error.message);
    }

    // ========================================
    // TEST 8: Select All in Patents
    // ========================================
    try {
      await wait(1000);
      
      const selectAllClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const selectAllBtn = buttons.find(btn => btn.textContent.includes('Select All'));
        if (selectAllBtn) {
          selectAllBtn.click();
          return true;
        }
        return false;
      });
      
      await wait(1000);
      await takeScreenshot(page, 'patents-selected-all');
      
      recordTest('Select All Patents', selectAllClicked, selectAllClicked ? '' : 'Select All button not found');
    } catch (error) {
      recordTest('Select All Patents', false, error.message);
    }

    // ========================================
    // TEST 9: Learning Plans - Add Plan
    // ========================================
    console.log('\n📚 TEST GROUP: Learning Plans');
    try {
      // Navigate to Learning Plans
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const planTab = tabs.find(tab => 
          tab.textContent.includes('Study Plans') || 
          tab.textContent.includes('Learning')
        );
        if (planTab) planTab.click();
      });
      await wait(2000);
      await takeScreenshot(page, 'plans-tab');
      
      // Fill plan form
      await page.waitForSelector('input[placeholder*="title"], input[id*="title"]', { timeout: 5000 });
      
      const titleInput = await page.$('input[placeholder*="title"], input[id*="title"]');
      const descInput = await page.$('textarea[placeholder*="description"], textarea[id*="description"]');
      
      if (titleInput && descInput) {
        await titleInput.click({ clickCount: 3 });
        await titleInput.type(testPlan.title);
        await descInput.click({ clickCount: 3 });
        await descInput.type(testPlan.description);
        
        // Select category
        await page.evaluate((category) => {
          const selects = Array.from(document.querySelectorAll('select, [role="combobox"]'));
          for (const select of selects) {
            if (select.closest('div')?.textContent.includes('Category')) {
              if (select.tagName === 'SELECT') {
                select.value = category;
                select.dispatchEvent(new Event('change', { bubbles: true }));
              } else {
                select.click();
              }
              break;
            }
          }
        }, testPlan.category);
        
        await wait(500);
        
        await page.evaluate((category) => {
          const options = Array.from(document.querySelectorAll('[role="option"]'));
          const option = options.find(opt => opt.textContent.includes(category));
          if (option) option.click();
        }, testPlan.category);
        
        await wait(500);
        
        // Click Add button
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const addBtn = buttons.find(btn => 
            btn.textContent.includes('Add Plan') || 
            (btn.textContent.includes('Add') && !btn.textContent.includes('User'))
          );
          if (addBtn) addBtn.click();
        });
        
        await wait(3000);
        await takeScreenshot(page, 'learning-plan-added');
        
        const planCreated = await page.evaluate((title) => {
          return document.body.innerText.includes(title);
        }, testPlan.title);
        
        recordTest('Add Learning Plan', planCreated, planCreated ? '' : 'Plan not found in list');
      } else {
        recordTest('Add Learning Plan', false, 'Form inputs not found');
      }
    } catch (error) {
      recordTest('Add Learning Plan', false, error.message);
    }

    // ========================================
    // TEST 10: Edit Learning Plan
    // ========================================
    try {
      await wait(1000);
      
      const editClicked = await page.evaluate((title) => {
        const cards = Array.from(document.querySelectorAll('[class*="Card"]'));
        const planCard = cards.find(card => card.textContent.includes(title));
        
        if (planCard) {
          const buttons = planCard.querySelectorAll('button');
          const editBtn = Array.from(buttons).find(btn => 
            btn.querySelector('svg') && btn.getAttribute('class')?.includes('outline')
          );
          if (editBtn) {
            editBtn.click();
            return true;
          }
        }
        return false;
      }, testPlan.title);
      
      if (editClicked) {
        await wait(1000);
        
        // Change status
        await page.evaluate(() => {
          const selects = Array.from(document.querySelectorAll('select, [role="combobox"]'));
          const statusSelect = selects.find(sel => 
            sel.closest('div')?.textContent.includes('Status')
          );
          if (statusSelect) {
            if (statusSelect.tagName === 'SELECT') {
              statusSelect.value = 'in-progress';
              statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
              statusSelect.click();
            }
          }
        });
        
        await wait(500);
        
        await page.evaluate(() => {
          const options = Array.from(document.querySelectorAll('[role="option"]'));
          const option = options.find(opt => opt.textContent.includes('In Progress'));
          if (option) option.click();
        });
        
        await wait(500);
        
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const saveBtn = buttons.find(btn => btn.textContent.includes('Save'));
          if (saveBtn) saveBtn.click();
        });
        
        await wait(2000);
        await takeScreenshot(page, 'learning-plan-edited');
      }
      
      recordTest('Edit Learning Plan', editClicked, editClicked ? '' : 'Edit button not found');
    } catch (error) {
      recordTest('Edit Learning Plan', false, error.message);
    }

    // ========================================
    // TEST 11: Select All in Learning Plans
    // ========================================
    try {
      await wait(1000);
      
      const selectAllClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const selectAllBtn = buttons.find(btn => btn.textContent.includes('Select All'));
        if (selectAllBtn) {
          selectAllBtn.click();
          return true;
        }
        return false;
      });
      
      await wait(1000);
      await takeScreenshot(page, 'plans-selected-all');
      
      recordTest('Select All Plans', selectAllClicked, selectAllClicked ? '' : 'Select All button not found');
    } catch (error) {
      recordTest('Select All Plans', false, error.message);
    }

    // ========================================
    // TEST 12: User Info in Header
    // ========================================
    console.log('\n🔍 TEST GROUP: UI Features');
    try {
      // Navigate back to dashboard
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const contactTab = tabs.find(tab => tab.textContent.includes('Contact'));
        if (contactTab) contactTab.click();
      });
      await wait(1000);
      
      const userInfoExists = await page.evaluate((email) => {
        // Check if user email is displayed in header
        const header = document.querySelector('header, [class*="header"], h1')?.closest('div');
        if (header) {
          return header.innerText.includes(email);
        }
        return false;
      }, ADMIN_EMAIL);
      
      await takeScreenshot(page, 'user-info-header');
      
      recordTest('User Info in Header', userInfoExists, userInfoExists ? '' : 'User info not visible in header');
    } catch (error) {
      recordTest('User Info in Header', false, error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed} (${Math.round(results.passed / results.total * 100)}%)`);
    console.log(`❌ Failed: ${results.failed} (${Math.round(results.failed / results.total * 100)}%)`);
    console.log('='.repeat(60));
    
    console.log('\n📋 Detailed Results:');
    results.tests.forEach((test, index) => {
      const status = test.passed ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${test.name}${test.message ? ` - ${test.message}` : ''}`);
    });

    // Save results to JSON
    const resultsFile = path.join(SCREENSHOTS_DIR, `test-results-${Date.now()}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${resultsFile}`);
    
  } catch (error) {
    console.error('\n💥 Fatal Error:', error);
  } finally {
    if (browser) {
      console.log('\n🔒 Closing browser...');
      await browser.close();
      console.log('✅ Browser closed');
    }
  }
  
  console.log('\n🏁 Test execution completed!\n');
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
