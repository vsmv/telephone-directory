import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    console.log('🔐 Password change attempt');

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get user from auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth token');
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Decode token to get user email (simple JWT decode)
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userEmail = payload.email;

      console.log('👤 User from token:', userEmail);

      if (!userEmail) {
        return NextResponse.json(
          { error: 'Invalid token - no email found' },
          { status: 401 }
        );
      }

      // Create Supabase admin client
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      // Get user credentials from database
      const { data: credentials, error: fetchError } = await supabaseAdmin
        .from('user_credentials')
        .select('email, password')
        .eq('email', userEmail.toLowerCase())
        .single();

      if (fetchError) {
        console.error('❌ Database error:', fetchError);
        return NextResponse.json(
          { error: 'Database error: ' + fetchError.message },
          { status: 500 }
        );
      }

      if (!credentials) {
        console.log('❌ User not found');
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      console.log('✅ User credentials found');

      // Verify current password (plain text comparison)
      if (credentials.password !== currentPassword) {
        console.log('❌ Current password is incorrect');
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      console.log('✅ Current password verified');

      // Update password in database (plain text - matching existing pattern)
      const { error: updateError } = await supabaseAdmin
        .from('user_credentials')
        .update({ 
          password: newPassword
        })
        .eq('email', userEmail.toLowerCase());

      if (updateError) {
        console.error('❌ Error updating password:', updateError);
        return NextResponse.json(
          { error: 'Failed to update password: ' + updateError.message },
          { status: 500 }
        );
      }

      console.log('✅ Password updated successfully');

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully'
      });

    } catch (decodeError) {
      console.error('❌ Token decode error:', decodeError);
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('❌ Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
