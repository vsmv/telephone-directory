#!/usr/bin/env node

// Script to run Codacy analysis as a pre-commit hook
const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running Codacy pre-commit analysis...');

try {
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  }).trim();

  if (!stagedFiles) {
    console.log('✅ No files to analyze');
    process.exit(0);
  }

  // Filter for supported file types
  const supportedFiles = stagedFiles.split('\n').filter(file => {
    return /\.(js|jsx|ts|tsx|css|html|java|py|go)$/.test(file);
  });

  if (supportedFiles.length === 0) {
    console.log('✅ No supported files to analyze');
    process.exit(0);
  }

  console.log(`🔬 Analyzing ${supportedFiles.length} staged files with Codacy...`);

  // Run Codacy analysis on staged files
  const filesArg = supportedFiles.join(' ');
  try {
    execSync(`codacy-cli analyze --files "${filesArg}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    console.log('✅ Codacy analysis completed successfully!');
    process.exit(0);
  } catch (analysisError) {
    console.log('❌ Codacy analysis found issues!');
    console.log('Please fix the issues before committing.');
    console.log('You can bypass this check with: git commit --no-verify');
    process.exit(1);
  }
} catch (error) {
  if (error.message.includes('codacy-cli')) {
    console.log('⚠️ Codacy CLI is not installed. Skipping analysis.');
    console.log('To install Codacy CLI, run: npm run codacy:install');
    process.exit(0);
  } else {
    console.log('❌ Error running Codacy analysis:', error.message);
    process.exit(1);
  }
}