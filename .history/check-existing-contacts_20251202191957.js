const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkContacts() {
  console.log('\n📊 CHECKING CURRENT CONTACTS IN DATABASE\n');
  
  const { data, error } = await supabase
    .from('contacts')
    .select('name, email, extension')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  console.log(`✅ Found ${data.length} contacts in database:\n`);
  data.forEach((contact, i) => {
    console.log(`${i + 1}. ${contact.name}`);
    console.log(`   Email: ${contact.email}`);
    console.log(`   Extension: ${contact.extension}`);
    console.log('');
  });
}

checkContacts().catch(console.error);
