#!/usr/bin/env node

// Script to run Codacy analysis on the project
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Running Codacy Analysis...');

// Function to execute command
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Main analysis function
async function runCodacyAnalysis() {
  try {
    // Check if Codacy CLI is installed
    console.log('🔍 Checking Codacy CLI installation...');
    await runCommand('codacy-cli --version');
    console.log('✅ Codacy CLI is installed');
  } catch (error) {
    console.log('⚠️ Codacy CLI is not installed');
    console.log('Please install Codacy CLI by following the instructions at:');
    console.log('https://github.com/codacy/codacy-analysis-cli#install');
    process.exit(0);
  }

  try {
    // Run Codacy analysis
    console.log('🔬 Running Codacy analysis on the project...');
    const { stdout, stderr } = await runCommand('codacy-cli analyze');
    
    if (stdout) {
      console.log('📋 Analysis output:');
      console.log(stdout);
    }
    
    if (stderr) {
      console.log('⚠️ Analysis warnings:');
      console.log(stderr);
    }
    
    console.log('✅ Codacy analysis completed successfully!');
  } catch (error) {
    console.log('❌ Codacy analysis failed:');
    if (error.stdout) {
      console.log(error.stdout);
    }
    if (error.stderr) {
      console.log(error.stderr);
    }
    process.exit(1);
  }
}

// Run the analysis
runCodacyAnalysis();