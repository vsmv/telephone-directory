import { NextResponse } from 'next/server';
import { userService } from '@/lib/database';

export async function GET() {
  try {
    const result = await userService.getUsers();
    
    if (result.error) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result.data 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch users' 
    }, { status: 500 });
  }
}
