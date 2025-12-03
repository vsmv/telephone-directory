import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Secret for JWT verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Helper to get user from JWT token
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as 'admin' | 'regular'
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('email');
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch users' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Only admins can update user roles
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: 'ID and role are required' }, { status: 400 });
    }

    if (role !== 'admin' && role !== 'regular') {
      return NextResponse.json({ error: 'Invalid role. Must be admin or regular' }, { status: 400 });
    }

    // Check if we're trying to demote the last admin
    const { data: targetUser } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', id)
      .single();

    if (targetUser && targetUser.role === 'admin' && role === 'regular') {
      // Count total admins
      const { data: allAdmins, error: adminError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'admin');

      if (adminError) {
        return NextResponse.json({ error: 'Failed to verify admin count' }, { status: 500 });
      }

      if (allAdmins && allAdmins.length <= 1) {
        return NextResponse.json({ 
          error: 'Cannot demote the last administrator. The system must have at least one admin.' 
        }, { status: 403 });
      }
    }

    // Update user role
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
