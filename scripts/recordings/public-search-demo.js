const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure recordings directory exists
const recordingsDir = path.join(__dirname, 'recordings');
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

async function recordPublicSearchDemo() {
  console.log('🚀 Starting Public Search Demo Recording...');
  
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
    
    // Click on Search Directory
    console.log('🔍 Clicking on Search Directory...');
    await page.click('a[href="/search"]');
    await page.waitForTimeout(2000);
    
    // Perform various search operations
    console.log('🔎 Performing search operations...');
    
    // Basic search
    console.log('🔤 Performing basic search...');
    await page.type('input[placeholder*="Search"]', 'Doctor');
    await page.waitForTimeout(2000);
    
    // Clear search
    console.log('🧹 Clearing search...');
    await page.click('button:has-text("Clear")');
    await page.waitForTimeout(1000);
    
    // Advanced search with wildcard
    console.log('🔍 Performing advanced search with wildcard...');
    await page.type('input[placeholder*="Search"]', 'Dr.*');
    await page.waitForTimeout(2000);
    
    // Clear search
    await page.click('button:has-text("Clear")');
    await page.waitForTimeout(1000);
    
    // Search by department
    console.log('🏢 Searching by department...');
    await page.type('input[placeholder*="Search"]', 'Medical Administration');
    await page.waitForTimeout(2000);
    
    // Clear search
    await page.click('button:has-text("Clear")');
    await page.waitForTimeout(1000);
    
    // Search by email
    console.log('📧 Searching by email...');
    await page.type('input[placeholder*="Search"]', '*@actrec.gov.in');
    await page.waitForTimeout(2000);
    
    // Clear search
    await page.click('button:has-text("Clear")');
    await page.waitForTimeout(1000);
    
    // Search by extension
    console.log('📞 Searching by extension...');
    await page.type('input[placeholder*="Search"]', '5042');
    await page.waitForTimeout(2000);
    
    // Clear search
    await page.click('button:has-text("Clear")');
    await page.waitForTimeout(1000);
    
    // Search by location
    console.log('📍 Searching by location...');
    await page.type('input[placeholder*="Search"]', 'Second Floor');
    await page.waitForTimeout(2000);
    
    // Navigate back to home
    console.log('🏠 Navigating back to home...');
    await page.click('button:has-text("Back to Home")');
    await page.waitForTimeout(2000);
    
    console.log('✅ Public Search Demo Recording Completed!');
    
  } catch (error) {
    console.error('❌ Error during recording:', error);
  } finally {
    await browser.close();
    console.log('⏹️  Screen recording finished and browser closed.');
  }
}

// Run the demo
recordPublicSearchDemo().catch(console.error);