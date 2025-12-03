const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyPassword() {
  const email = 'jeyarish.venki@gmail.com';
  const testPassword = '3nt&irZtWr5Y';
  
  console.log('\n🔑 PASSWORD VERIFICATION\n');
  console.log('Email:', email);
  console.log('Test Password:', testPassword);
  console.log('');
  
  const { data, error } = await supabase
    .from('user_credentials')
    .select('email, password')
    .eq('email', email)
    .single();
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  console.log('Database Password:', data.password);
  console.log('');
  
  // Character by character comparison
  console.log('📊 Character-by-character comparison:');
  console.log('');
  console.log('Position | Test       | DB         | Match');
  console.log('-'.repeat(50));
  
  const maxLen = Math.max(testPassword.length, (data.password || '').length);
  for (let i = 0; i < maxLen; i++) {
    const testChar = testPassword[i] || '';
    const dbChar = (data.password || '')[i] || '';
    const match = testChar === dbChar ? '✓' : '✗';
    const testCharCode = testChar ? testChar.charCodeAt(0) : '-';
    const dbCharCode = dbChar ? dbChar.charCodeAt(0) : '-';
    
    console.log(
      `${i.toString().padStart(8)} | ` +
      `${testChar.padEnd(10)} | ` +
      `${dbChar.padEnd(10)} | ` +
      `${match} (${testCharCode} vs ${dbCharCode})`
    );
  }
  
  console.log('');
  console.log('Match Result:', testPassword === data.password ? '✅ MATCH' : '❌ NO MATCH');
  console.log('Test Length:', testPassword.length);
  console.log('DB Length:', (data.password || '').length);
}

verifyPassword().catch(console.error);
