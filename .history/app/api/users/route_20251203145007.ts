import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PUT - Update user role
export async function PUT(request: NextRequest) {
  try {
    const { id, role } = await request.json();

    if (!id || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    if (role !== 'admin' && role !== 'regular') {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or regular' },
        { status: 400 }
      );
    }

    console.log(`📝 Updating user ${id} to role: ${role}`);

    // Update user with service role (bypasses RLS)
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ 
        role, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to update user:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User updated successfully:', data);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('💥 Update user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}
