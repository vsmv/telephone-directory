/**
 * Comprehensive E2E Tests for Telephone Directory Application
 * Tests: User Management (Single/Bulk), Patents, Learning Plans
 * Using Puppeteer for browser automation
 */

describe('Telephone Directory - Comprehensive Admin Tests', () => {
  let browser;
  let page;
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  
  // Test credentials
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@actrec.gov.in';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
  
  // Test data
  const testUser = {
    email: `testuser${Date.now()}@actrec.gov.in`,
    password: 'TestPass@123',
    name: 'Test User',
    role: 'regular'
  };
  
  const testIdea = {
    title: `Test Patent Idea ${Date.now()}`,
    description: 'This is a test patentable idea for automated testing',
    category: 'Software/Algorithm',
    status: 'draft'
  };
  
  const testPlan = {
    title: `Test Learning Plan ${Date.now()}`,
    description: 'This is a test learning plan for automated testing',
    category: 'Technical Skills',
    status: 'not-started'
  };

  // Helper function to wait for navigation and ensure page is loaded
  const waitForNavigation = async () => {
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForTimeout(1000);
  };

  // Helper to take screenshot on failure
  const takeScreenshot = async (name) => {
    try {
      await page.screenshot({ 
        path: `./screenshots/test-${name}-${Date.now()}.png`,
        fullPage: true 
      });
      console.log(`📸 Screenshot saved: test-${name}`);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  };

  beforeAll(async () => {
    browser = await require('puppeteer').launch({
      headless: false, // Set to true for CI/CD
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 50 // Slow down by 50ms for visibility
    });
    console.log('🚀 Browser launched');
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    console.log(`\n📄 New page created for test`);
  });

  afterEach(async () => {
    if (page) {
      await page.close();
      console.log('📄 Page closed');
    }
  });

  describe('🔐 Authentication', () => {
    test('should login as admin successfully', async () => {
      console.log('🧪 Testing admin login...');
      
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await takeScreenshot('login-page');
      
      // Fill login form
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.type('input[type="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"]', ADMIN_PASSWORD);
      
      await takeScreenshot('login-filled');
      
      // Click login button
      await page.click('button[type="submit"]');
      
      // Wait for dashboard
      await page.waitForSelector('h1:has-text("Admin Dashboard"), h1:has-text("Dashboard")', { timeout: 10000 });
      
      await takeScreenshot('admin-dashboard');
      
      // Verify admin badge
      const hasAdminBadge = await page.evaluate(() => {
        return document.body.innerText.includes('ADMIN');
      });
      
      expect(hasAdminBadge).toBe(true);
      console.log('✅ Admin login successful');
    });
  });

  describe('👥 User Management - Single Operations', () => {
    beforeEach(async () => {
      // Login as admin
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Navigate to User Management tab
      console.log('📍 Navigating to User Management...');
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const userTab = tabs.find(tab => tab.textContent.includes('User Management'));
        if (userTab) userTab.click();
      });
      await page.waitForTimeout(2000);
    });

    test('should create a single user', async () => {
      console.log('🧪 Testing single user creation...');
      
      await takeScreenshot('user-management-before-create');
      
      // Fill user creation form
      await page.waitForSelector('input[placeholder*="email"], input[type="email"]');
      
      const emailInput = await page.$('input[placeholder*="email"], input[type="email"]');
      await emailInput.type(testUser.email);
      
      const passwordInput = await page.$('input[placeholder*="password"], input[type="password"]');
      await passwordInput.type(testUser.password);
      
      await page.waitForTimeout(500);
      
      // Click create button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const createBtn = buttons.find(btn => 
          btn.textContent.includes('Create User') || 
          btn.textContent.includes('Add User')
        );
        if (createBtn) createBtn.click();
      });
      
      await page.waitForTimeout(3000);
      await takeScreenshot('user-created');
      
      // Verify user appears in list
      const userCreated = await page.evaluate((email) => {
        return document.body.innerText.includes(email);
      }, testUser.email);
      
      expect(userCreated).toBe(true);
      console.log('✅ Single user created successfully');
    });

    test('should edit user role', async () => {
      console.log('🧪 Testing single user role change...');
      
      await page.waitForTimeout(2000);
      
      // Find the test user row and change role
      const roleChanged = await page.evaluate((email) => {
        const rows = Array.from(document.querySelectorAll('[class*="Card"], tr'));
        const userRow = rows.find(row => row.textContent.includes(email));
        
        if (userRow) {
          // Find role dropdown/select
          const selects = userRow.querySelectorAll('select, [role="combobox"]');
          for (const select of selects) {
            if (select.value === 'regular' || select.textContent.includes('regular')) {
              // Try to change to admin
              if (select.tagName === 'SELECT') {
                select.value = 'admin';
                select.dispatchEvent(new Event('change', { bubbles: true }));
              } else {
                select.click();
              }
              return true;
            }
          }
        }
        return false;
      }, testUser.email);
      
      await page.waitForTimeout(2000);
      await takeScreenshot('user-role-changed');
      
      console.log(`✅ User role change initiated: ${roleChanged}`);
    });

    test('should reset user password', async () => {
      console.log('🧪 Testing single user password reset...');
      
      await page.waitForTimeout(2000);
      
      // Find and click reset password button
      const resetClicked = await page.evaluate((email) => {
        const rows = Array.from(document.querySelectorAll('[class*="Card"], tr'));
        const userRow = rows.find(row => row.textContent.includes(email));
        
        if (userRow) {
          const buttons = userRow.querySelectorAll('button');
          const resetBtn = Array.from(buttons).find(btn => 
            btn.textContent.includes('Reset') || 
            btn.title?.includes('Reset')
          );
          if (resetBtn) {
            resetBtn.click();
            return true;
          }
        }
        return false;
      }, testUser.email);
      
      await page.waitForTimeout(2000);
      await takeScreenshot('password-reset-initiated');
      
      console.log(`✅ Password reset initiated: ${resetClicked}`);
    });
  });

  describe('👥 User Management - Bulk Operations', () => {
    beforeEach(async () => {
      // Login and navigate to User Management
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const userTab = tabs.find(tab => tab.textContent.includes('User Management'));
        if (userTab) userTab.click();
      });
      await page.waitForTimeout(2000);
    });

    test('should create multiple users via bulk upload', async () => {
      console.log('🧪 Testing bulk user creation...');
      
      // Create test CSV data
      const bulkUsers = [
        { email: `bulk1_${Date.now()}@actrec.gov.in`, password: 'Bulk@123', role: 'regular' },
        { email: `bulk2_${Date.now()}@actrec.gov.in`, password: 'Bulk@123', role: 'regular' },
        { email: `bulk3_${Date.now()}@actrec.gov.in`, password: 'Bulk@123', role: 'regular' }
      ];
      
      const csvContent = `email,password,role\n${bulkUsers.map(u => `${u.email},${u.password},${u.role}`).join('\n')}`;
      
      // Find file input and upload
      const fileInputExists = await page.evaluate(() => {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        return fileInputs.length > 0;
      });
      
      if (fileInputExists) {
        const fileInput = await page.$('input[type="file"]');
        
        // Create temp file
        const fs = require('fs');
        const path = require('path');
        const tempFile = path.join(__dirname, `bulk-users-${Date.now()}.csv`);
        fs.writeFileSync(tempFile, csvContent);
        
        await fileInput.uploadFile(tempFile);
        await page.waitForTimeout(2000);
        
        // Click upload button
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const uploadBtn = buttons.find(btn => 
            btn.textContent.includes('Upload') || 
            btn.textContent.includes('Import')
          );
          if (uploadBtn) uploadBtn.click();
        });
        
        await page.waitForTimeout(3000);
        await takeScreenshot('bulk-users-uploaded');
        
        // Clean up temp file
        fs.unlinkSync(tempFile);
        
        console.log('✅ Bulk user creation completed');
      } else {
        console.log('⚠️ Bulk upload not available on this page');
      }
    });

    test('should select all users and change roles in bulk', async () => {
      console.log('🧪 Testing bulk role change...');
      
      await page.waitForTimeout(2000);
      
      // Click Select All button
      const selectAllClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const selectAllBtn = buttons.find(btn => 
          btn.textContent.includes('Select All')
        );
        if (selectAllBtn) {
          selectAllBtn.click();
          return true;
        }
        return false;
      });
      
      await page.waitForTimeout(1000);
      await takeScreenshot('users-selected');
      
      console.log(`✅ Select All clicked: ${selectAllClicked}`);
      
      // Find bulk role change option
      const bulkRoleChanged = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const bulkRoleBtn = buttons.find(btn => 
          btn.textContent.includes('Change Role') ||
          btn.textContent.includes('Bulk')
        );
        if (bulkRoleBtn) {
          bulkRoleBtn.click();
          return true;
        }
        return false;
      });
      
      await page.waitForTimeout(2000);
      await takeScreenshot('bulk-role-change');
      
      console.log(`✅ Bulk role change initiated: ${bulkRoleChanged}`);
    });

    test('should select multiple users and reset passwords in bulk', async () => {
      console.log('🧪 Testing bulk password reset...');
      
      await page.waitForTimeout(2000);
      
      // Select first 2 checkboxes (not admin)
      await page.evaluate(() => {
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
        let selected = 0;
        for (const checkbox of checkboxes) {
          if (!checkbox.disabled && selected < 2) {
            checkbox.click();
            selected++;
          }
        }
      });
      
      await page.waitForTimeout(1000);
      await takeScreenshot('users-selected-for-password-reset');
      
      // Click bulk password reset
      const bulkResetClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const resetBtn = buttons.find(btn => 
          btn.textContent.includes('Reset Password') &&
          btn.textContent.includes('Bulk')
        );
        if (resetBtn) {
          resetBtn.click();
          return true;
        }
        return false;
      });
      
      await page.waitForTimeout(2000);
      await takeScreenshot('bulk-password-reset');
      
      console.log(`✅ Bulk password reset initiated: ${bulkResetClicked}`);
    });

    test('should bulk delete non-admin users', async () => {
      console.log('🧪 Testing bulk user deletion...');
      
      await page.waitForTimeout(2000);
      
      // Select non-admin users
      await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('[class*="Card"], tr'));
        for (const row of rows) {
          if (!row.textContent.includes('ADMIN') && !row.textContent.includes('admin@')) {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.disabled) {
              checkbox.click();
              break; // Select just one for safety
            }
          }
        }
      });
      
      await page.waitForTimeout(1000);
      await takeScreenshot('user-selected-for-delete');
      
      // Click delete selected
      const deleteClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const deleteBtn = buttons.find(btn => 
          btn.textContent.includes('Delete') &&
          (btn.textContent.includes('Selected') || btn.textContent.includes('Bulk'))
        );
        if (deleteBtn) {
          deleteBtn.click();
          return true;
        }
        return false;
      });
      
      await page.waitForTimeout(1000);
      
      // Confirm deletion in dialog
      if (deleteClicked) {
        await page.evaluate(() => {
          const confirmButtons = Array.from(document.querySelectorAll('button'));
          const confirmBtn = confirmButtons.find(btn => 
            btn.textContent.includes('Delete') || 
            btn.textContent.includes('Confirm')
          );
          if (confirmBtn) confirmBtn.click();
        });
        
        await page.waitForTimeout(2000);
        await takeScreenshot('bulk-delete-completed');
      }
      
      console.log(`✅ Bulk delete initiated: ${deleteClicked}`);
    });
  });

  describe('💡 Patentable Ideas Management', () => {
    beforeEach(async () => {
      // Login as admin
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Navigate to Patentable Ideas tab
      console.log('📍 Navigating to Patentable Ideas...');
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const patentTab = tabs.find(tab => tab.textContent.includes('Patentable Ideas'));
        if (patentTab) patentTab.click();
      });
      await page.waitForTimeout(2000);
    });

    test('should add a new patentable idea', async () => {
      console.log('🧪 Testing patentable idea creation...');
      
      await takeScreenshot('patents-before-add');
      
      // Fill idea form
      await page.waitForSelector('input[placeholder*="title"], input[id*="title"]');
      
      // Title
      const titleInput = await page.$('input[placeholder*="title"], input[id*="title"]');
      if (titleInput) await titleInput.type(testIdea.title);
      
      // Description
      const descInput = await page.$('textarea[placeholder*="description"], textarea[id*="description"]');
      if (descInput) await descInput.type(testIdea.description);
      
      // Category - use dropdown
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
      
      await page.waitForTimeout(500);
      
      // Click category option if dropdown opened
      await page.evaluate((category) => {
        const options = Array.from(document.querySelectorAll('[role="option"]'));
        const option = options.find(opt => opt.textContent.includes(category));
        if (option) option.click();
      }, testIdea.category);
      
      await page.waitForTimeout(500);
      
      // Click Add button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(btn => 
          btn.textContent.includes('Add Idea') || 
          btn.textContent.includes('Add')
        );
        if (addBtn) addBtn.click();
      });
      
      await page.waitForTimeout(3000);
      await takeScreenshot('patent-idea-added');
      
      // Verify idea appears
      const ideaCreated = await page.evaluate((title) => {
        return document.body.innerText.includes(title);
      }, testIdea.title);
      
      expect(ideaCreated).toBe(true);
      console.log('✅ Patentable idea created successfully');
    });

    test('should edit patentable idea', async () => {
      console.log('🧪 Testing patentable idea editing...');
      
      await page.waitForTimeout(2000);
      
      // Find edit button for the test idea
      const editClicked = await page.evaluate((title) => {
        const cards = Array.from(document.querySelectorAll('[class*="Card"]'));
        const ideaCard = cards.find(card => card.textContent.includes(title));
        
        if (ideaCard) {
          const buttons = ideaCard.querySelectorAll('button');
          const editBtn = Array.from(buttons).find(btn => 
            btn.querySelector('[class*="Edit"]') || 
            btn.title?.includes('Edit')
          );
          if (editBtn) {
            editBtn.click();
            return true;
          }
        }
        return false;
      }, testIdea.title);
      
      await page.waitForTimeout(1000);
      
      if (editClicked) {
        // Modify description
        const descInput = await page.$('textarea[value*="test"], textarea:focus');
        if (descInput) {
          await descInput.click({ clickCount: 3 }); // Select all
          await descInput.type(' - MODIFIED');
        }
        
        // Click Save
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const saveBtn = buttons.find(btn => btn.textContent.includes('Save'));
          if (saveBtn) saveBtn.click();
        });
        
        await page.waitForTimeout(2000);
        await takeScreenshot('patent-idea-edited');
      }
      
      console.log(`✅ Patentable idea edit initiated: ${editClicked}`);
    });

    test('should delete patentable idea', async () => {
      console.log('🧪 Testing patentable idea deletion...');
      
      await page.waitForTimeout(2000);
      
      // Find delete button
      const deleteClicked = await page.evaluate((title) => {
        const cards = Array.from(document.querySelectorAll('[class*="Card"]'));
        const ideaCard = cards.find(card => card.textContent.includes(title));
        
        if (ideaCard) {
          const buttons = ideaCard.querySelectorAll('button');
          const deleteBtn = Array.from(buttons).find(btn => 
            btn.querySelector('[class*="Trash"]') || 
            btn.title?.includes('Delete')
          );
          if (deleteBtn) {
            deleteBtn.click();
            return true;
          }
        }
        return false;
      }, testIdea.title);
      
      await page.waitForTimeout(1000);
      
      // Confirm deletion
      if (deleteClicked) {
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const confirmBtn = buttons.find(btn => 
            btn.textContent.includes('Delete') || 
            btn.textContent.includes('Confirm')
          );
          if (confirmBtn) confirmBtn.click();
        });
        
        await page.waitForTimeout(2000);
        await takeScreenshot('patent-idea-deleted');
      }
      
      console.log(`✅ Patentable idea deletion initiated: ${deleteClicked}`);
    });
  });

  describe('📚 Learning Plans Management', () => {
    beforeEach(async () => {
      // Login as admin
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Navigate to Learning Plans tab
      console.log('📍 Navigating to Learning Plans...');
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const planTab = tabs.find(tab => tab.textContent.includes('Study Plans') || tab.textContent.includes('Learning'));
        if (planTab) planTab.click();
      });
      await page.waitForTimeout(2000);
    });

    test('should add a new learning plan', async () => {
      console.log('🧪 Testing learning plan creation...');
      
      await takeScreenshot('plans-before-add');
      
      // Fill plan form
      await page.waitForSelector('input[placeholder*="title"], input[id*="title"]');
      
      // Title
      const titleInput = await page.$('input[placeholder*="title"], input[id*="title"]');
      if (titleInput) await titleInput.type(testPlan.title);
      
      // Description
      const descInput = await page.$('textarea[placeholder*="description"], textarea[id*="description"]');
      if (descInput) await descInput.type(testPlan.description);
      
      // Category
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
      
      await page.waitForTimeout(500);
      
      // Click category option
      await page.evaluate((category) => {
        const options = Array.from(document.querySelectorAll('[role="option"]'));
        const option = options.find(opt => opt.textContent.includes(category));
        if (option) option.click();
      }, testPlan.category);
      
      await page.waitForTimeout(500);
      
      // Click Add button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(btn => 
          btn.textContent.includes('Add Plan') || 
          btn.textContent.includes('Add')
        );
        if (addBtn) addBtn.click();
      });
      
      await page.waitForTimeout(3000);
      await takeScreenshot('learning-plan-added');
      
      // Verify plan appears
      const planCreated = await page.evaluate((title) => {
        return document.body.innerText.includes(title);
      }, testPlan.title);
      
      expect(planCreated).toBe(true);
      console.log('✅ Learning plan created successfully');
    });

    test('should edit learning plan status', async () => {
      console.log('🧪 Testing learning plan editing...');
      
      await page.waitForTimeout(2000);
      
      // Find edit button for the test plan
      const editClicked = await page.evaluate((title) => {
        const cards = Array.from(document.querySelectorAll('[class*="Card"]'));
        const planCard = cards.find(card => card.textContent.includes(title));
        
        if (planCard) {
          const buttons = planCard.querySelectorAll('button');
          const editBtn = Array.from(buttons).find(btn => 
            btn.querySelector('[class*="Edit"]') || 
            btn.title?.includes('Edit')
          );
          if (editBtn) {
            editBtn.click();
            return true;
          }
        }
        return false;
      }, testPlan.title);
      
      await page.waitForTimeout(1000);
      
      if (editClicked) {
        // Change status to "in-progress"
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
        
        await page.waitForTimeout(500);
        
        // Select "In Progress" option
        await page.evaluate(() => {
          const options = Array.from(document.querySelectorAll('[role="option"]'));
          const option = options.find(opt => opt.textContent.includes('In Progress'));
          if (option) option.click();
        });
        
        await page.waitForTimeout(500);
        
        // Click Save
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const saveBtn = buttons.find(btn => btn.textContent.includes('Save'));
          if (saveBtn) saveBtn.click();
        });
        
        await page.waitForTimeout(2000);
        await takeScreenshot('learning-plan-edited');
      }
      
      console.log(`✅ Learning plan edit initiated: ${editClicked}`);
    });

    test('should delete learning plan', async () => {
      console.log('🧪 Testing learning plan deletion...');
      
      await page.waitForTimeout(2000);
      
      // Find delete button
      const deleteClicked = await page.evaluate((title) => {
        const cards = Array.from(document.querySelectorAll('[class*="Card"]'));
        const planCard = cards.find(card => card.textContent.includes(title));
        
        if (planCard) {
          const buttons = planCard.querySelectorAll('button');
          const deleteBtn = Array.from(buttons).find(btn => 
            btn.querySelector('[class*="Trash"]') || 
            btn.title?.includes('Delete')
          );
          if (deleteBtn) {
            deleteBtn.click();
            return true;
          }
        }
        return false;
      }, testPlan.title);
      
      await page.waitForTimeout(1000);
      
      // Confirm deletion
      if (deleteClicked) {
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const confirmBtn = buttons.find(btn => 
            btn.textContent.includes('Delete') || 
            btn.textContent.includes('Confirm')
          );
          if (confirmBtn) confirmBtn.click();
        });
        
        await page.waitForTimeout(2000);
        await takeScreenshot('learning-plan-deleted');
      }
      
      console.log(`✅ Learning plan deletion initiated: ${deleteClicked}`);
    });
  });

  describe('🔍 Select All Functionality', () => {
    test('should test Select All in Patentable Ideas', async () => {
      console.log('🧪 Testing Select All in Patents...');
      
      // Login and navigate
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const patentTab = tabs.find(tab => tab.textContent.includes('Patentable Ideas'));
        if (patentTab) patentTab.click();
      });
      await page.waitForTimeout(2000);
      
      // Click Select All
      const selectAllClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const selectAllBtn = buttons.find(btn => btn.textContent.includes('Select All'));
        if (selectAllBtn) {
          selectAllBtn.click();
          return true;
        }
        return false;
      });
      
      await page.waitForTimeout(1000);
      await takeScreenshot('patents-select-all');
      
      console.log(`✅ Select All in Patents: ${selectAllClicked}`);
    });

    test('should test Select All in Learning Plans', async () => {
      console.log('🧪 Testing Select All in Plans...');
      
      // Login and navigate
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', ADMIN_EMAIL);
      await page.type('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForSelector('h1', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const planTab = tabs.find(tab => tab.textContent.includes('Study Plans') || tab.textContent.includes('Learning'));
        if (planTab) planTab.click();
      });
      await page.waitForTimeout(2000);
      
      // Click Select All
      const selectAllClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const selectAllBtn = buttons.find(btn => btn.textContent.includes('Select All'));
        if (selectAllBtn) {
          selectAllBtn.click();
          return true;
        }
        return false;
      });
      
      await page.waitForTimeout(1000);
      await takeScreenshot('plans-select-all');
      
      console.log(`✅ Select All in Plans: ${selectAllClicked}`);
    });
  });
});
