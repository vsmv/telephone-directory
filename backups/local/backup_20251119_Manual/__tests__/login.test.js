const puppeteer = require('puppeteer');
require('dotenv').config();

describe('Login Functionality', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      slowMo: 10 // Slow down operations for better visibility
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should login with valid credentials', async () => {
    // Navigate to the login page
    await page.goto('http://localhost:3001/login');
    
    // Wait for the page to load
    await page.waitForSelector('input[type="email"]');
    
    // Fill in the login form
    await page.type('input[type="email"]', 'priya.sharma@actrec.gov.in');
    await page.type('input[type="password"]', 'Jaishiva123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation or a specific element that indicates successful login
    // This might need to be adjusted based on your application's behavior
    await page.waitForSelector('.dashboard', { timeout: 10000 });
    
    // Verify that we're on the dashboard page
    const url = page.url();
    expect(url).toContain('/dashboard');
  }, 30000); // 30 second timeout

  test('should login with admin credentials', async () => {
    // Navigate to the login page
    await page.goto('http://localhost:3001/login');
    
    // Wait for the page to load
    await page.waitForSelector('input[type="email"]');
    
    // Fill in the login form
    await page.type('input[type="email"]', 'admin@actrec.gov.in');
    await page.type('input[type="password"]', 'admin123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation or a specific element that indicates successful login
    await page.waitForSelector('.dashboard', { timeout: 10000 });
    
    // Verify that we're on the dashboard page
    const url = page.url();
    expect(url).toContain('/dashboard');
  }, 30000); // 30 second timeout
});