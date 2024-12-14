import { getAllUsers } from '@/data-access/users';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allUsers = await getAllUsers();

    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
} 