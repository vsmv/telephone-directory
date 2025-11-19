// Comprehensive test with Puppeteer for data display and cascade operations
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFullApplication() {
  console.log('🚀 Starting Comprehensive Application Test\n');
  
  let browser;
  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for CI/CD
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging from browser
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Error:', msg.text());
      }
    });
    
    // Test 1: Check if dev server is running
    console.log('🔍 Testing dev server connection...');
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
      console.log('✅ Dev server is running');
    } catch (error) {
      console.log('❌ Dev server not accessible:', error.message);
      return;
    }
    
    // Test 2: Navigate to dashboard
    console.log('\n📊 Testing dashboard access...');
    try {
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
      
      // Check if redirected to login (expected behavior)
      const currentUrl = page.url();
      if (currentUrl.includes('/auth/login')) {
        console.log('✅ Properly redirected to login page');
        
        // Test login
        console.log('🔐 Testing login...');
        await page.type('input[type="email"]', 'admin@actrec.gov.in');
        await page.type('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        
        // Wait for redirect back to dashboard
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log('✅ Login successful');
      } else {
        console.log('✅ Direct dashboard access (no auth required)');
      }
    } catch (error) {
      console.log('⚠️  Dashboard access issue:', error.message);
    }
    
    // Test 3: Check Learning Plans tab
    console.log('\n📚 Testing Learning Plans data display...');
    try {
      // Look for Learning Plans tab and click it
      await page.waitForSelector('[data-value="learning"], [role="tab"]', { timeout: 5000 });
      
      // Try different selectors for the learning plans tab
      const learningTab = await page.$('[data-value="learning"]') || 
                         await page.$('button:contains("Study Plans")') ||
                         await page.$('button:contains("Learning")');
      
      if (learningTab) {
        await learningTab.click();
        await page.waitForTimeout(2000); // Wait for data to load
        
        // Check if data is displayed
        const planElements = await page.$$('.space-y-4 > div, [data-testid="learning-plan"]');
        console.log(`✅ Found ${planElements.length} learning plan elements`);
        
        // Check for "No data" message
        const noDataText = await page.$eval('body', el => el.textContent);
        if (noDataText.includes('No learning plans found') || noDataText.includes('No data')) {
          console.log('⚠️  No learning plans data displayed');
        } else {
          console.log('✅ Learning plans data is visible');
        }
      } else {
        console.log('⚠️  Learning Plans tab not found');
      }
    } catch (error) {
      console.log('⚠️  Learning Plans test error:', error.message);
    }
    
    // Test 4: Check Patentable Ideas tab
    console.log('\n💡 Testing Patentable Ideas data display...');
    try {
      // Look for Patentable Ideas tab
      const ideasTab = await page.$('[data-value="patents"]') || 
                      await page.$('button:contains("Patentable Ideas")') ||
                      await page.$('button:contains("Patents")');
      
      if (ideasTab) {
        await ideasTab.click();
        await page.waitForTimeout(2000);
        
        const ideaElements = await page.$$('.space-y-4 > div, [data-testid="patentable-idea"]');
        console.log(`✅ Found ${ideaElements.length} patentable idea elements`);
        
        const noDataText = await page.$eval('body', el => el.textContent);
        if (noDataText.includes('No patentable ideas found') || noDataText.includes('No data')) {
          console.log('⚠️  No patentable ideas data displayed');
        } else {
          console.log('✅ Patentable ideas data is visible');
        }
      } else {
        console.log('⚠️  Patentable Ideas tab not found');
      }
    } catch (error) {
      console.log('⚠️  Patentable Ideas test error:', error.message);
    }
    
    // Test 5: API Routes directly
    console.log('\n🔌 Testing API routes directly...');
    
    try {
      const learningResponse = await page.evaluate(async () => {
        const response = await fetch('/api/learning-plans');
        return await response.json();
      });
      
      if (learningResponse.data) {
        console.log(`✅ Learning Plans API: ${learningResponse.data.length} records`);
      } else {
        console.log('❌ Learning Plans API error:', learningResponse.error);
      }
    } catch (error) {
      console.log('❌ Learning Plans API test failed:', error.message);
    }
    
    try {
      const ideasResponse = await page.evaluate(async () => {
        const response = await fetch('/api/patentable-ideas');
        return await response.json();
      });
      
      if (ideasResponse.data) {
        console.log(`✅ Patentable Ideas API: ${ideasResponse.data.length} records`);
      } else {
        console.log('❌ Patentable Ideas API error:', ideasResponse.error);
      }
    } catch (error) {
      console.log('❌ Patentable Ideas API test failed:', error.message);
    }
    
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'dashboard-test-screenshot.png', fullPage: true });
    console.log('✅ Screenshot saved as dashboard-test-screenshot.png');
    
  } catch (error) {
    console.log('💥 Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Test 6: Database Cascade Operations
  console.log('\n🗄️  Testing Database Cascade Operations...');
  await testCascadeOperations();
}

async function testCascadeOperations() {
  console.log('\n=== CASCADE OPERATIONS TEST ===\n');
  
  const testEmail = 'cascade.test@actrec.gov.in';
  const testUserId = 'test-cascade-user-123';
  
  try {
    // Step 1: Create test contact
    console.log('1️⃣ Creating test contact...');
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert({
        name: 'Cascade Test User',
        email: testEmail,
        extension: '9999',
        department: 'Test Department',
        designation: 'Test Role',
        phone_number: '1234567890',
        location: 'Test Location',
        institution: 'ACTREC'
      })
      .select()
      .single();
    
    if (contactError) {
      console.log('❌ Contact creation failed:', contactError.message);
      return;
    }
    console.log('✅ Contact created:', contact.name);
    
    // Step 2: Create user profile
    console.log('\n2️⃣ Creating user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: testUserId,
        email: testEmail,
        role: 'regular'
      })
      .select()
      .single();
    
    if (profileError) {
      console.log('❌ User profile creation failed:', profileError.message);
    } else {
      console.log('✅ User profile created:', profile.email);
    }
    
    // Step 3: Create user credentials
    console.log('\n3️⃣ Creating user credentials...');
    const { data: credentials, error: credError } = await supabase
      .from('user_credentials')
      .insert({
        email: testEmail,
        password_hash: '$2b$10$test.hash.for.cascade.test'
      })
      .select()
      .single();
    
    if (credError) {
      console.log('❌ User credentials creation failed:', credError.message);
    } else {
      console.log('✅ User credentials created');
    }
    
    // Step 4: Create learning plan linked to contact
    console.log('\n4️⃣ Creating learning plan...');
    const { data: plan, error: planError } = await supabase
      .from('learning_plans')
      .insert({
        email: testEmail,
        title: 'Cascade Test Learning Plan',
        description: 'This is a test learning plan for cascade operations',
        category: 'Testing',
        status: 'in-progress'
      })
      .select()
      .single();
    
    if (planError) {
      console.log('❌ Learning plan creation failed:', planError.message);
    } else {
      console.log('✅ Learning plan created:', plan.title);
    }
    
    // Step 5: Create patentable idea linked to contact
    console.log('\n5️⃣ Creating patentable idea...');
    const { data: idea, error: ideaError } = await supabase
      .from('patentable_ideas')
      .insert({
        email: testEmail,
        title: 'Cascade Test Patentable Idea',
        description: 'This is a test patentable idea for cascade operations',
        category: 'Testing',
        status: 'draft'
      })
      .select()
      .single();
    
    if (ideaError) {
      console.log('❌ Patentable idea creation failed:', ideaError.message);
    } else {
      console.log('✅ Patentable idea created:', idea.title);
    }
    
    // Step 6: Verify all records exist
    console.log('\n6️⃣ Verifying all records exist...');
    
    const { data: allContacts } = await supabase.from('contacts').select('*').eq('email', testEmail);
    const { data: allProfiles } = await supabase.from('user_profiles').select('*').eq('email', testEmail);
    const { data: allCredentials } = await supabase.from('user_credentials').select('*').eq('email', testEmail);
    const { data: allPlans } = await supabase.from('learning_plans').select('*').eq('email', testEmail);
    const { data: allIdeas } = await supabase.from('patentable_ideas').select('*').eq('email', testEmail);
    
    console.log(`📊 Records found:`);
    console.log(`   Contacts: ${allContacts?.length || 0}`);
    console.log(`   User Profiles: ${allProfiles?.length || 0}`);
    console.log(`   User Credentials: ${allCredentials?.length || 0}`);
    console.log(`   Learning Plans: ${allPlans?.length || 0}`);
    console.log(`   Patentable Ideas: ${allIdeas?.length || 0}`);
    
    // Step 7: Test CASCADE DELETE by deleting contact
    console.log('\n7️⃣ Testing CASCADE DELETE (deleting contact)...');
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .eq('email', testEmail);
    
    if (deleteError) {
      console.log('❌ Contact deletion failed:', deleteError.message);
    } else {
      console.log('✅ Contact deleted successfully');
    }
    
    // Step 8: Verify cascade delete worked
    console.log('\n8️⃣ Verifying cascade delete...');
    
    const { data: remainingContacts } = await supabase.from('contacts').select('*').eq('email', testEmail);
    const { data: remainingPlans } = await supabase.from('learning_plans').select('*').eq('email', testEmail);
    const { data: remainingIdeas } = await supabase.from('patentable_ideas').select('*').eq('email', testEmail);
    
    console.log(`📊 Records after cascade delete:`);
    console.log(`   Contacts: ${remainingContacts?.length || 0}`);
    console.log(`   Learning Plans: ${remainingPlans?.length || 0}`);
    console.log(`   Patentable Ideas: ${remainingIdeas?.length || 0}`);
    
    if ((remainingContacts?.length || 0) === 0 && 
        (remainingPlans?.length || 0) === 0 && 
        (remainingIdeas?.length || 0) === 0) {
      console.log('✅ CASCADE DELETE working correctly!');
    } else {
      console.log('⚠️  CASCADE DELETE may not be working as expected');
    }
    
    // Cleanup any remaining records
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('user_profiles').delete().eq('email', testEmail);
    await supabase.from('user_credentials').delete().eq('email', testEmail);
    
    console.log('✅ Cascade operations test completed');
    
  } catch (error) {
    console.log('💥 Cascade operations test failed:', error.message);
  }
}

// Run the test
testFullApplication().then(() => {
  console.log('\n🎉 All tests completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});