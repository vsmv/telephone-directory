const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure recordings directory exists
const recordingsDir = path.join(__dirname, 'recordings');
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

async function recordUserDemo() {
  console.log('🚀 Starting User Demo Recording...');
  
  const browser = await puppeteer.launch({
    headless: false, // We need to see the UI for demo purposes
    slowMo: 50, // Slow down operations for better viewing
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    // Start recording
    console.log('⏺️  Starting screen recording...');
    
    // Navigate to home page
    console.log('🏠 Navigating to home page...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Click on Login
    console.log('🔐 Clicking on Login...');
    await page.click('a[href="/auth/login"]');
    await page.waitForTimeout(2000);
    
    // For this demo, we'll need to create a regular user first or use an existing one
    // Let's assume there's a regular user with email: user@actrec.gov.in and password: user123
    console.log('👤 Logging in as Regular User...');
    await page.type('#username', 'user@actrec.gov.in');
    await page.type('#password', 'user123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Record User Dashboard Overview
    console.log('📊 Recording User Dashboard Overview...');
    await page.waitForTimeout(3000);
    
    // Navigate through user tabs
    const tabs = ['search', 'learning', 'patents', 'settings'];
    
    for (const tab of tabs) {
      console.log(`📋 Recording ${tab} tab...`);
      try {
        await page.click(`button[role="tab"][value="${tab}"]`);
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`⚠️  Could not click ${tab} tab`);
      }
    }
    
    // Search Demo (User)
    console.log('🔍 Recording User Search...');
    await page.click('button[role="tab"][value="search"]');
    await page.waitForTimeout(2000);
    await page.type('input[placeholder*="Search"]', 'Doctor');
    await page.waitForTimeout(2000);
    
    // Learning Plans Demo (User)
    console.log('📚 Recording User Learning Plans...');
    await page.click('button[role="tab"][value="learning"]');
    await page.waitForTimeout(2000);
    
    // Add a learning plan
    console.log('📝 Adding a learning plan...');
    await page.type('input#plan-title', 'My Learning Goal');
    await page.type('textarea#plan-description', 'This is my personal learning goal.');
    await page.type('input#plan-category', 'Professional Development');
    await page.click('button:has-text("Add Learning Plan")');
    await page.waitForTimeout(2000);
    
    // Patentable Ideas Demo (User)
    console.log('💡 Recording User Patentable Ideas...');
    await page.click('button[role="tab"][value="patents"]');
    await page.waitForTimeout(2000);
    
    // Add a patentable idea
    console.log('🔬 Adding a patentable idea...');
    await page.type('input#idea-title', 'My Innovation Idea');
    await page.type('textarea#idea-description', 'This is my innovative idea for improvement.');
    await page.type('input#idea-category', 'Process Improvement');
    await page.click('button:has-text("Add Patentable Idea")');
    await page.waitForTimeout(2000);
    
    // Settings Demo (User)
    console.log('⚙️  Recording User Settings...');
    await page.click('button[role="tab"][value="settings"]');
    await page.waitForTimeout(2000);
    
    // Change password
    console.log('🔑 Recording Password Change...');
    await page.type('input#currentPassword', 'user123');
    await page.type('input#newPassword', 'newuser123');
    await page.type('input#confirmPassword', 'newuser123');
    await page.click('button:has-text("Update Password")');
    await page.waitForTimeout(3000);
    
    // Reset password back
    console.log('🔄 Resetting password back...');
    await page.type('input#currentPassword', 'newuser123');
    await page.type('input#newPassword', 'user123');
    await page.type('input#confirmPassword', 'user123');
    await page.click('button:has-text("Update Password")');
    await page.waitForTimeout(3000);
    
    // Logout
    console.log('👋 Logging out...');
    await page.click('button:has-text("Logout")');
    await page.waitForTimeout(2000);
    
    console.log('✅ User Demo Recording Completed!');
    
  } catch (error) {
    console.error('❌ Error during recording:', error);
  } finally {
    await browser.close();
    console.log('⏹️  Screen recording finished and browser closed.');
  }
}

// Run the demo
recordUserDemo().catch(console.error);