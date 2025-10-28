// Test the Supabase client used in the application
const { createClient } = require('@supabase/supabase-js');

// Use the same configuration as in the app
const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg0ODMsImV4cCI6MjA3MjAzNDQ4M30.iR_SFZiXYLVgeXvAMDo4H_SwVdrwaIWQtzI08UeaNYI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAppSupabase() {
  console.log('🔍 Testing Supabase client used in the application...\n');
  
  const userEmail = 'priya.sharma@actrec.gov.in';
  const userPassword = 'password@@0vgqUq6WsA';
  
  try {
    // First, authenticate the user
    console.log('🔐 Authenticating user...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword
    });
    
    if (authError) {
      console.error('Authentication error:', authError);
    } else {
      console.log('Authentication successful:', authData);
    }
    
    // Test learning plans
    console.log('\n--- Testing Learning Plans with App Supabase Client ---');
    const { data: plans, error: plansError } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('email', userEmail);
    
    if (plansError) {
      console.error('Error fetching learning plans:', plansError);
    } else {
      console.log(`Learning plans found: ${plans?.length || 0}`);
      if (plans && plans.length > 0) {
        console.log('First learning plan:', plans[0]);
      }
    }
    
    // Test patentable ideas
    console.log('\n--- Testing Patentable Ideas with App Supabase Client ---');
    const { data: ideas, error: ideasError } = await supabase
      .from('patentable_ideas')
      .select('*')
      .eq('email', userEmail);
    
    if (ideasError) {
      console.error('Error fetching patentable ideas:', ideasError);
    } else {
      console.log(`Patentable ideas found: ${ideas?.length || 0}`);
      if (ideas && ideas.length > 0) {
        console.log('First patentable idea:', ideas[0]);
      }
    }
    
  } catch (error) {
    console.error('💥 Error testing app Supabase client:', error);
  }
  
  console.log('\n🏁 App Supabase client test completed');
}

testAppSupabase();