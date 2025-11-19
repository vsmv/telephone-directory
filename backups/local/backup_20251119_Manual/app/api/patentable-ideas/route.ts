import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role on server side (secure - not exposed to browser)
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

// Helper to get user from session
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  // Get user role from database
  const { data: userData } = await supabase
    .from('user_profiles')
    .select('email, role')
    .eq('id', user.id)
    .single();
  
  return userData;
}

// GET - Fetch patentable ideas (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    let query = supabase
      .from('patentable_ideas')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Regular users can only see their own ideas
    if (user.role === 'regular') {
      query = query.eq('email', user.email);
    }
    // Admins can see all ideas
    
    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new patentable idea
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('patentable_ideas')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update patentable idea (ownership check)
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check ownership - users can only edit their own ideas
    const { data: existingIdea } = await supabase
      .from('patentable_ideas')
      .select('email')
      .eq('id', id)
      .single();
    
    if (!existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    if (existingIdea.email !== user.email) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own ideas' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('patentable_ideas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete patentable idea (ownership check)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check ownership - users can only delete their own ideas
    const { data: existingIdea } = await supabase
      .from('patentable_ideas')
      .select('email')
      .eq('id', id)
      .single();
    
    if (!existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    if (existingIdea.email !== user.email) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own ideas' }, { status: 403 });
    }

    const { error } = await supabase
      .from('patentable_ideas')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
