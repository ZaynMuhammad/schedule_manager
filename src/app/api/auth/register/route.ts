import { db } from '@/db';
import { users } from '@/db/schema';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, username, password, timezone } = await request.json();

    // Validate input
    if (!email || !username || !password || !timezone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const [user] = await db.insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
        timezone,  // Save the timezone
      })
      .returning();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Error registering user' },
      { status: 500 }
    );
  }
}