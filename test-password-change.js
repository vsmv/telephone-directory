// Test script to verify password change functionality
const { authService } = require('./lib/auth');

async function testPasswordChange() {
  console.log('Testing password change functionality...');
  
  // Test login with original password
  console.log('1. Testing login with original password...');
  const originalLogin = await authService.login('priya.sharma@actrec.gov.in', 'password@@0vgqUq6WsA');
  console.log('Original login result:', originalLogin.user ? 'SUCCESS' : 'FAILED', originalLogin.error || '');
  
  // Test updating demo account password
  console.log('2. Updating demo account password...');
  authService.updateDemoAccountPassword('priya.sharma@actrec.gov.in', 'newpassword123');
  console.log('Password updated in memory');
  
  // Test login with new password
  console.log('3. Testing login with new password...');
  const newLogin = await authService.login('priya.sharma@actrec.gov.in', 'newpassword123');
  console.log('New login result:', newLogin.user ? 'SUCCESS' : 'FAILED', newLogin.error || '');
  
  // Test login with old password (should fail)
  console.log('4. Testing login with old password (should fail)...');
  const oldLogin = await authService.login('priya.sharma@actrec.gov.in', 'password@@0vgqUq6WsA');
  console.log('Old password login result:', oldLogin.user ? 'UNEXPECTED SUCCESS' : 'EXPECTED FAILURE', oldLogin.error || '');
  
  console.log('Password change test completed!');
}

testPasswordChange().catch(console.error);