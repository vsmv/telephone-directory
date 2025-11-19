// Comprehensive CRUD testing with Puppeteer
const puppeteer = require('puppeteer');

async function runCompleteCRUDTests() {
  console.log('🚀 Starting Comprehensive CRUD Tests\n');
  console.log('='.repeat(70));
  
  let browser;
  const results = {
    passed: [],
    failed: [],
    skipped: []
  };
  
  try {
    // Launch browser
    console.log('\n📱 Launching browser...');
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1280, height: 900 },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 100 // Slow down for visibility
    });
    
    const page = await browser.newPage();
    
    // Enable console logging from browser
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('✅') || text.includes('❌') || text.includes('📊')) {
        console.log(`   Browser: ${text}`);
      }
    });
    
    // ============================================================
    // TEST 1: Login
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 1: User Login');
    console.log('='.repeat(70));
    
    try {
      await page.goto('http://localhost:3000/auth/login', { waitUntil: 'networkidle0', timeout: 10000 });
      
      // Fill login form
      await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 5000 });
      await page.type('input[type="email"], input[name="email"]', 'admin@actrec.gov.in');
      await page.type('input[type="password"], input[name="password"]', 'admin123');
      
      // Click login button
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
      
      const url = page.url();
      if (url.includes('/dashboard')) {
        console.log('✅ Login successful - Redirected to dashboard');
        results.passed.push('Login');
      } else {
        throw new Error('Not redirected to dashboard');
      }
    } catch (error) {
      console.log('❌ Login failed:', error.message);
      results.failed.push('Login');
    }
    
    // ============================================================
    // TEST 2: Create Contact (User)
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 2: Create New Contact');
    console.log('='.repeat(70));
    
    try {
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
      
      // Wait for contacts tab
      await page.waitForSelector('[data-value="contacts"], button:has-text("Contact Management")', { timeout: 5000 });
      
      // Fill new contact form
      const testContact = {
        name: 'Test User Puppeteer',
        email: 'test.puppeteer@actrec.gov.in',
        extension: '9999',
        department: 'Testing',
        designation: 'Test Engineer',
        phone: '1234567890',
        location: 'Test Lab',
        institution: 'ACTREC'
      };
      
      await page.type('input[id="name"]', testContact.name);
      await page.type('input[id="email"]', testContact.email);
      await page.type('input[id="extension"]', testContact.extension);
      await page.type('input[id="department"]', testContact.department);
      await page.type('input[id="designation"]', testContact.designation);
      await page.type('input[id="phone"]', testContact.phone);
      await page.type('input[id="location"]', testContact.location);
      await page.type('input[id="institution"]', testContact.institution);
      
      // Click Add Contact button
      await page.click('button:has-text("Add Contact")');
      await page.waitForTimeout(2000);
      
      // Verify contact was added
      const pageContent = await page.content();
      if (pageContent.includes(testContact.name)) {
        console.log('✅ Contact created successfully:', testContact.name);
        results.passed.push('Create Contact');
      } else {
        throw new Error('Contact not found in list');
      }
    } catch (error) {
      console.log('❌ Create contact failed:', error.message);
      results.failed.push('Create Contact');
    }
    
    // ============================================================
    // TEST 3: Edit Single Contact
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 3: Edit Single Contact');
    console.log('='.repeat(70));
    
    try {
      // Find and click edit button for the test contact
      const editButtons = await page.$$('button[aria-label="Edit"], button:has-text("Edit")');
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await page.waitForTimeout(1000);
        
        // Modify a field
        const nameInput = await page.$('input[id="name"]');
        await nameInput.click({ clickCount: 3 }); // Select all
        await nameInput.type('Test User Puppeteer EDITED');
        
        // Save changes
        await page.click('button:has-text("Update Contact"), button:has-text("Save")');
        await page.waitForTimeout(2000);
        
        const pageContent = await page.content();
        if (pageContent.includes('EDITED')) {
          console.log('✅ Contact edited successfully');
          results.passed.push('Edit Single Contact');
        } else {
          throw new Error('Edit not reflected');
        }
      } else {
        throw new Error('No edit button found');
      }
    } catch (error) {
      console.log('❌ Edit contact failed:', error.message);
      results.failed.push('Edit Single Contact');
    }
    
    // ============================================================
    // TEST 4: Create Learning Plan
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 4: Create Learning Plan');
    console.log('='.repeat(70));
    
    try {
      // Navigate to learning plans tab
      await page.click('[data-value="learning"], button:has-text("Study Plans"), button:has-text("Learning")');
      await page.waitForTimeout(2000);
      
      // Fill new plan form
      const testPlan = {
        title: 'Puppeteer Test Plan',
        description: 'This is a test learning plan created by Puppeteer',
        category: 'Testing'
      };
      
      await page.type('input[id="title"]', testPlan.title);
      await page.type('textarea[id="description"]', testPlan.description);
      await page.type('input[id="category"]', testPlan.category);
      
      // Click Add Plan button
      await page.click('button:has-text("Add Plan")');
      await page.waitForTimeout(3000);
      
      // Verify plan was added
      const pageContent = await page.content();
      if (pageContent.includes(testPlan.title)) {
        console.log('✅ Learning plan created successfully:', testPlan.title);
        results.passed.push('Create Learning Plan');
      } else {
        throw new Error('Learning plan not found');
      }
    } catch (error) {
      console.log('❌ Create learning plan failed:', error.message);
      results.failed.push('Create Learning Plan');
    }
    
    // ============================================================
    // TEST 5: Edit Learning Plan
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 5: Edit Learning Plan');
    console.log('='.repeat(70));
    
    try {
      // Find and click edit button
      const editButtons = await page.$$('button[aria-label="Edit"]');
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await page.waitForTimeout(1000);
        
        // Modify title
        const titleInputs = await page.$$('input[value*="Puppeteer"]');
        if (titleInputs.length > 0) {
          await titleInputs[0].click({ clickCount: 3 });
          await titleInputs[0].type('Puppeteer Test Plan EDITED');
          
          // Save changes
          await page.click('button:has-text("Save")');
          await page.waitForTimeout(2000);
          
          const pageContent = await page.content();
          if (pageContent.includes('EDITED')) {
            console.log('✅ Learning plan edited successfully');
            results.passed.push('Edit Learning Plan');
          } else {
            throw new Error('Edit not reflected');
          }
        } else {
          throw new Error('Title input not found');
        }
      } else {
        throw new Error('No edit button found');
      }
    } catch (error) {
      console.log('❌ Edit learning plan failed:', error.message);
      results.failed.push('Edit Learning Plan');
    }
    
    // ============================================================
    // TEST 6: Create Patentable Idea
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 6: Create Patentable Idea');
    console.log('='.repeat(70));
    
    try {
      // Navigate to patentable ideas tab
      await page.click('[data-value="patents"], button:has-text("Patentable Ideas"), button:has-text("Patents")');
      await page.waitForTimeout(2000);
      
      // Fill new idea form
      const testIdea = {
        title: 'Puppeteer Test Idea',
        description: 'This is a test patentable idea created by Puppeteer',
        category: 'Testing'
      };
      
      await page.type('input[id="title"]', testIdea.title);
      await page.type('textarea[id="description"]', testIdea.description);
      await page.type('input[id="category"]', testIdea.category);
      
      // Click Add Idea button
      await page.click('button:has-text("Add Idea")');
      await page.waitForTimeout(3000);
      
      // Verify idea was added
      const pageContent = await page.content();
      if (pageContent.includes(testIdea.title)) {
        console.log('✅ Patentable idea created successfully:', testIdea.title);
        results.passed.push('Create Patentable Idea');
      } else {
        throw new Error('Patentable idea not found');
      }
    } catch (error) {
      console.log('❌ Create patentable idea failed:', error.message);
      results.failed.push('Create Patentable Idea');
    }
    
    // ============================================================
    // TEST 7: Edit Patentable Idea
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 7: Edit Patentable Idea');
    console.log('='.repeat(70));
    
    try {
      // Find and click edit button
      const editButtons = await page.$$('button[aria-label="Edit"]');
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await page.waitForTimeout(1000);
        
        // Modify title
        const titleInputs = await page.$$('input[value*="Puppeteer"]');
        if (titleInputs.length > 0) {
          await titleInputs[0].click({ clickCount: 3 });
          await titleInputs[0].type('Puppeteer Test Idea EDITED');
          
          // Save changes
          await page.click('button:has-text("Save")');
          await page.waitForTimeout(2000);
          
          const pageContent = await page.content();
          if (pageContent.includes('EDITED')) {
            console.log('✅ Patentable idea edited successfully');
            results.passed.push('Edit Patentable Idea');
          } else {
            throw new Error('Edit not reflected');
          }
        } else {
          throw new Error('Title input not found');
        }
      } else {
        throw new Error('No edit button found');
      }
    } catch (error) {
      console.log('❌ Edit patentable idea failed:', error.message);
      results.failed.push('Edit Patentable Idea');
    }
    
    // ============================================================
    // TEST 8: Delete Patentable Idea
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 8: Delete Patentable Idea');
    console.log('='.repeat(70));
    
    try {
      // Handle confirmation dialog
      page.on('dialog', async dialog => {
        console.log('   Confirmation dialog:', dialog.message());
        await dialog.accept();
      });
      
      // Find and click delete button
      const deleteButtons = await page.$$('button[aria-label="Delete"]');
      if (deleteButtons.length > 0) {
        await deleteButtons[0].click();
        await page.waitForTimeout(2000);
        
        const pageContent = await page.content();
        if (!pageContent.includes('Puppeteer Test Idea EDITED')) {
          console.log('✅ Patentable idea deleted successfully');
          results.passed.push('Delete Patentable Idea');
        } else {
          throw new Error('Idea still present');
        }
      } else {
        throw new Error('No delete button found');
      }
    } catch (error) {
      console.log('❌ Delete patentable idea failed:', error.message);
      results.failed.push('Delete Patentable Idea');
    }
    
    // ============================================================
    // TEST 9: Delete Learning Plan
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 9: Delete Learning Plan');
    console.log('='.repeat(70));
    
    try {
      // Navigate back to learning plans
      await page.click('[data-value="learning"], button:has-text("Study Plans"), button:has-text("Learning")');
      await page.waitForTimeout(2000);
      
      // Find and click delete button
      const deleteButtons = await page.$$('button[aria-label="Delete"]');
      if (deleteButtons.length > 0) {
        await deleteButtons[0].click();
        await page.waitForTimeout(2000);
        
        const pageContent = await page.content();
        if (!pageContent.includes('Puppeteer Test Plan EDITED')) {
          console.log('✅ Learning plan deleted successfully');
          results.passed.push('Delete Learning Plan');
        } else {
          throw new Error('Plan still present');
        }
      } else {
        throw new Error('No delete button found');
      }
    } catch (error) {
      console.log('❌ Delete learning plan failed:', error.message);
      results.failed.push('Delete Learning Plan');
    }
    
    // ============================================================
    // TEST 10: Delete Contact
    // ============================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST 10: Delete Contact');
    console.log('='.repeat(70));
    
    try {
      // Navigate back to contacts
      await page.click('[data-value="contacts"], button:has-text("Contact Management")');
      await page.waitForTimeout(2000);
      
      // Find and click delete button for test contact
      const deleteButtons = await page.$$('button[aria-label="Delete"]');
      if (deleteButtons.length > 0) {
        await deleteButtons[0].click();
        await page.waitForTimeout(2000);
        
        const pageContent = await page.content();
        if (!pageContent.includes('Test User Puppeteer')) {
          console.log('✅ Contact deleted successfully');
          results.passed.push('Delete Contact');
        } else {
          throw new Error('Contact still present');
        }
      } else {
        throw new Error('No delete button found');
      }
    } catch (error) {
      console.log('❌ Delete contact failed:', error.message);
      results.failed.push('Delete Contact');
    }
    
    // Take final screenshot
    console.log('\n📸 Taking final screenshot...');
    await page.screenshot({ path: 'test-results-screenshot.png', fullPage: true });
    console.log('✅ Screenshot saved as test-results-screenshot.png');
    
  } catch (error) {
    console.log('\n💥 Test suite error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // ============================================================
  // FINAL RESULTS
  // ============================================================
  console.log('\n' + '='.repeat(70));
  console.log('FINAL TEST RESULTS');
  console.log('='.repeat(70));
  
  console.log(`\n✅ PASSED (${results.passed.length}):`);
  results.passed.forEach(test => console.log(`   ✓ ${test}`));
  
  if (results.failed.length > 0) {
    console.log(`\n❌ FAILED (${results.failed.length}):`);
    results.failed.forEach(test => console.log(`   ✗ ${test}`));
  }
  
  if (results.skipped.length > 0) {
    console.log(`\n⚠️  SKIPPED (${results.skipped.length}):`);
    results.skipped.forEach(test => console.log(`   - ${test}`));
  }
  
  const total = results.passed.length + results.failed.length + results.skipped.length;
  const passRate = ((results.passed.length / total) * 100).toFixed(1);
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Total Tests: ${total}`);
  console.log(`   Passed: ${results.passed.length}`);
  console.log(`   Failed: ${results.failed.length}`);
  console.log(`   Skipped: ${results.skipped.length}`);
  console.log(`   Pass Rate: ${passRate}%`);
  
  console.log('\n' + '='.repeat(70));
  console.log('🎉 Test suite completed!');
  console.log('='.repeat(70) + '\n');
}

// Run the tests
runCompleteCRUDTests().catch(console.error);