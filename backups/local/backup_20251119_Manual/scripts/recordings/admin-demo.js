const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure recordings directory exists
const recordingsDir = path.join(__dirname, 'recordings');
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

async function recordAdminDemo() {
  console.log('🚀 Starting Admin Demo Recording...');
  
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
    
    // Login as Admin
    console.log('👤 Logging in as Admin...');
    await page.type('#username', 'admin@actrec.gov.in');
    await page.type('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Record Admin Dashboard Overview
    console.log('📊 Recording Admin Dashboard Overview...');
    await page.waitForTimeout(3000);
    
    // Navigate through all tabs
    const tabs = ['contacts', 'bulk', 'users', 'search', 'learning', 'patents', 'settings'];
    
    for (const tab of tabs) {
      console.log(`📋 Recording ${tab} tab...`);
      try {
        await page.click(`button[role="tab"][value="${tab}"]`);
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`⚠️  Could not click ${tab} tab, trying alternative selector...`);
        // Try alternative selector
        try {
          await page.click(`div[role="tablist"] button:nth-child(${tabs.indexOf(tab) + 1})`);
          await page.waitForTimeout(2000);
        } catch (innerError) {
          console.log(`⚠️  Could not click ${tab} tab with alternative selector`);
        }
      }
    }
    
    // Contact Management Demo
    console.log('📇 Recording Contact Management...');
    await page.click('button[role="tab"][value="contacts"]');
    await page.waitForTimeout(2000);
    
    // Add a new contact
    console.log('➕ Adding a new contact...');
    await page.type('input#name', 'Dr. Demo User');
    await page.type('input#department', 'Demo Department');
    await page.type('input#designation', 'Demo Specialist');
    await page.type('input#email', 'demo.user@actrec.gov.in');
    await page.type('input#phone_number', '1234567890');
    await page.type('input#extension', '9999');
    await page.type('input#location', 'Demo Floor');
    await page.click('button:has-text("Add Contact")');
    await page.waitForTimeout(3000);
    
    // Edit the contact
    console.log('✏️  Editing the contact...');
    await page.click('button:has-text("Edit")');
    await page.waitForTimeout(1000);
    await page.type('input#department', 'Updated Demo Department');
    await page.click('button:has-text("Update Contact")');
    await page.waitForTimeout(2000);
    
    // Delete the contact
    console.log('🗑️  Deleting the contact...');
    await page.click('button:has-text("Delete")');
    await page.waitForTimeout(2000);
    
    // Bulk Operations Demo
    console.log('📦 Recording Bulk Operations...');
    await page.click('button[role="tab"][value="bulk"]');
    await page.waitForTimeout(2000);
    
    // User Management Demo
    console.log('👥 Recording User Management...');
    await page.click('button[role="tab"][value="users"]');
    await page.waitForTimeout(2000);
    
    // Search Demo
    console.log('🔍 Recording Search...');
    await page.click('button[role="tab"][value="search"]');
    await page.waitForTimeout(2000);
    await page.type('input[placeholder*="Search"]', 'Dr. Demo');
    await page.waitForTimeout(2000);
    
    // Export CSV (Admin only feature)
    console.log('📤 Recording CSV Export...');
    try {
      await page.click('button:has-text("Export CSV")');
      await page.waitForTimeout(3000);
    } catch (error) {
      console.log('⚠️  CSV Export button not found or not accessible');
    }
    
    // Learning Plans Demo
    console.log('📚 Recording Learning Plans...');
    await page.click('button[role="tab"][value="learning"]');
    await page.waitForTimeout(2000);
    
    // Add a learning plan
    console.log('📝 Adding a learning plan...');
    await page.type('input#plan-title', 'Demo Learning Plan');
    await page.type('textarea#plan-description', 'This is a demo learning plan for demonstration purposes.');
    await page.type('input#plan-category', 'Demo');
    await page.click('button:has-text("Add Learning Plan")');
    await page.waitForTimeout(2000);
    
    // Patentable Ideas Demo
    console.log('💡 Recording Patentable Ideas...');
    await page.click('button[role="tab"][value="patents"]');
    await page.waitForTimeout(2000);
    
    // Add a patentable idea
    console.log('🔬 Adding a patentable idea...');
    await page.type('input#idea-title', 'Demo Patentable Idea');
    await page.type('textarea#idea-description', 'This is a demo patentable idea for demonstration purposes.');
    await page.type('input#idea-category', 'Demo');
    await page.click('button:has-text("Add Patentable Idea")');
    await page.waitForTimeout(2000);
    
    // Settings Demo
    console.log('⚙️  Recording Settings...');
    await page.click('button[role="tab"][value="settings"]');
    await page.waitForTimeout(2000);
    
    // Change password
    console.log('🔑 Recording Password Change...');
    await page.type('input#currentPassword', 'admin123');
    await page.type('input#newPassword', 'newadmin123');
    await page.type('input#confirmPassword', 'newadmin123');
    await page.click('button:has-text("Update Password")');
    await page.waitForTimeout(3000);
    
    // Reset password back
    console.log('🔄 Resetting password back...');
    await page.type('input#currentPassword', 'newadmin123');
    await page.type('input#newPassword', 'admin123');
    await page.type('input#confirmPassword', 'admin123');
    await page.click('button:has-text("Update Password")');
    await page.waitForTimeout(3000);
    
    // Logout
    console.log('👋 Logging out...');
    await page.click('button:has-text("Logout")');
    await page.waitForTimeout(2000);
    
    console.log('✅ Admin Demo Recording Completed!');
    
  } catch (error) {
    console.error('❌ Error during recording:', error);
  } finally {
    await browser.close();
    console.log('⏹️  Screen recording finished and browser closed.');
  }
}

// Run the demo
recordAdminDemo().catch(console.error);