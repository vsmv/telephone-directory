module.exports = {
  launch: {
    headless: false, // Set to true for CI/CD
    slowMo: 50, // Slow down by 50ms for better visibility
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080'
    ],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  },
  browserContext: 'default',
  server: {
    command: 'npm run dev',
    port: 3000,
    launchTimeout: 60000,
    debug: true
  }
};
