import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Testing Supabase Staging Database Connection...');
    console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Test 1: Check connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('contacts')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection Error:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      }, { status: 500 });
    }
    
    // Test 2: Count contacts
    const { count: contactCount, error: countError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });
    
    // Test 3: Count user profiles
    const { count: userCount, error: userError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    // Test 4: Count learning plans
    const { count: plansCount, error: plansError } = await supabase
      .from('learning_plans')
      .select('*', { count: 'exact', head: true });
    
    // Test 5: Count patentable ideas
    const { count: ideasCount, error: ideasError } = await supabase
      .from('patentable_ideas')
      .select('*', { count: 'exact', head: true });
    
    console.log('✅ Database Connection Successful!');
    console.log(`📊 Contacts: ${contactCount}`);
    console.log(`👥 Users: ${userCount}`);
    console.log(`📚 Learning Plans: ${plansCount}`);
    console.log(`💡 Patentable Ideas: ${ideasCount}`);
    
    return NextResponse.json({
      success: true,
      message: 'Supabase Staging Database Connected Successfully',
      database: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        environment: 'staging'
      },
      statistics: {
        contacts: contactCount || 0,
        users: userCount || 0,
        learningPlans: plansCount || 0,
        patentableIdeas: ideasCount || 0
      },
      errors: {
        contacts: countError?.message || null,
        users: userError?.message || null,
        learningPlans: plansError?.message || null,
        patentableIdeas: ideasError?.message || null
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('💥 Unexpected Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
