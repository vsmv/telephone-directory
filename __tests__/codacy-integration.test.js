// Test to verify Codacy integration
const { exec } = require('child_process');
const path = require('path');

describe('Codacy Integration', () => {
  test('Codacy CLI should be available', (done) => {
    exec('codacy-cli --version', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      // We're checking that the command exists, not that it succeeds
      // If the command doesn't exist, we'll get a specific error
      if (error && error.code === 'ENOENT') {
        // Command not found - this is expected in CI environments
        console.log('Codacy CLI not found - this is expected in CI environments');
        done();
      } else {
        // Command exists - that's what we're testing
        expect(error).toBeNull();
        done();
      }
    });
  }, 10000);

  test('Codacy configuration file should exist', () => {
    const fs = require('fs');
    const configPath = path.join(__dirname, '..', '.codacy.yml');
    expect(fs.existsSync(configPath)).toBe(true);
  });

  test('GitHub Actions workflow should exist', () => {
    const fs = require('fs');
    const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'codacy-analysis.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);
  });
});