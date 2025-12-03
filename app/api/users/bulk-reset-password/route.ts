import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userIds, passwords } = await request.json();

    if (!userIds || !passwords || userIds.length !== passwords.length) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const results = [];

    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const newPassword = passwords[i];

      // Get user email from user_profiles
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        results.push({
          userId,
          success: false,
          error: 'User not found'
        });
        continue;
      }

      // Update password in user_credentials table
      const { error } = await supabase
        .from('user_credentials')
        .upsert({
          email: profile.email,
          password: newPassword,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (error) {
        results.push({
          userId,
          email: profile.email,
          success: false,
          error: error.message
        });
      } else {
        results.push({
          userId,
          email: profile.email,
          password: newPassword,
          success: true
        });
      }
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Bulk password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
