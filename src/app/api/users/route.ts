import { db } from '@/db';
import { users } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        username: true,
        email: true,
        timezone: true,
      },
    });

    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
} 