// Simple script to check user data in Supabase
const { createClient } = require('@supabase/supabase-js');

// Use the same configuration as in the app
const supabaseUrl = 'https://pcrukmbtjyuuzwszsdsl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg0ODMsImV4cCI6MjA3MjAzNDQ4M30.iR_SFZiXYLVgeXvAMDo4H_SwVdrwaIWQtzI08UeaNYI';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ1ODQ4MywiZXhwIjoyMDcyMDM0NDgzfQ.HTOopBA2HsBzw7ZRW0xyTo2RiaFvWnWV-5x9knBs7kQ';

// Create both clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserData() {
  console.log('🔍 Checking user data in Supabase...\n');
  
  const userEmail = 'priya.sharma@actrec.gov.in';
  
  try {
    // Check if user exists in contacts
    console.log('--- Checking Contacts ---');
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', userEmail);
    
    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
    } else {
      console.log(`Contacts found: ${contacts?.length || 0}`);
      if (contacts && contacts.length > 0) {
        console.log('Contact details:', contacts[0]);
      }
    }
    
    // Check if user exists in user_profiles
    console.log('\n--- Checking User Profiles ---');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', userEmail);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      console.log(`Profiles found: ${profiles?.length || 0}`);
      if (profiles && profiles.length > 0) {
        console.log('Profile details:', profiles[0]);
      }
    }
    
    // Check if user exists in user_credentials
    console.log('\n--- Checking User Credentials ---');
    const { data: credentials, error: credentialsError } = await supabaseAdmin
      .from('user_credentials')
      .select('*')
      .eq('email', userEmail);
    
    if (credentialsError) {
      console.error('Error fetching credentials:', credentialsError);
    } else {
      console.log(`Credentials found: ${credentials?.length || 0}`);
      if (credentials && credentials.length > 0) {
        console.log('Credential details:', credentials[0]);
      }
    }
    
    // Check learning plans with admin client
    console.log('\n--- Checking Learning Plans (Admin Client) ---');
    const { data: plans, error: plansError } = await supabaseAdmin
      .from('learning_plans')
      .select('*')
      .eq('email', userEmail);
    
    if (plansError) {
      console.error('Error fetching learning plans:', plansError);
    } else {
      console.log(`Learning plans found: ${plans?.length || 0}`);
      if (plans && plans.length > 0) {
        console.log('Learning plan details:', plans[0]);
      }
    }
    
    // Check patentable ideas with admin client
    console.log('\n--- Checking Patentable Ideas (Admin Client) ---');
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('patentable_ideas')
      .select('*')
      .eq('email', userEmail);
    
    if (ideasError) {
      console.error('Error fetching patentable ideas:', ideasError);
    } else {
      console.log(`Patentable ideas found: ${ideas?.length || 0}`);
      if (ideas && ideas.length > 0) {
        console.log('Patentable idea details:', ideas[0]);
      }
    }
    
    // Check all learning plans (to see if there are any at all) with admin client
    console.log('\n--- Checking All Learning Plans (Admin Client) ---');
    const { data: allPlans, error: allPlansError } = await supabaseAdmin
      .from('learning_plans')
      .select('*')
      .limit(5);
    
    if (allPlansError) {
      console.error('Error fetching all learning plans:', allPlansError);
    } else {
      console.log(`Total learning plans in database: ${allPlans?.length || 0}`);
      if (allPlans && allPlans.length > 0) {
        console.log('Sample learning plan:', allPlans[0]);
      }
    }
    
    // Check all patentable ideas (to see if there are any at all) with admin client
    console.log('\n--- Checking All Patentable Ideas (Admin Client) ---');
    const { data: allIdeas, error: allIdeasError } = await supabaseAdmin
      .from('patentable_ideas')
      .select('*')
      .limit(5);
    
    if (allIdeasError) {
      console.error('Error fetching all patentable ideas:', allIdeasError);
    } else {
      console.log(`Total patentable ideas in database: ${allIdeas?.length || 0}`);
      if (allIdeas && allIdeas.length > 0) {
        console.log('Sample patentable idea:', allIdeas[0]);
      }
    }
    
  } catch (error) {
    console.error('💥 Error checking user data:', error);
  }
  
  console.log('\n🏁 Check completed');
}

checkUserData();