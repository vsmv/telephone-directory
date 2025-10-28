module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/__tests__/e2e/**/*.test.js'],
  setupFilesAfterEnv: ['expect-puppeteer'],
  testTimeout: 30000,
};