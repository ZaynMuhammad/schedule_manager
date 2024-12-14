import { createUser } from '@/data-access/users';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, username, password, timezone, startTime, endTime } = await request.json();

    // Validate input
    if (!email || !username || !password || !timezone || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    const user = await createUser({
      email,
      username,
      password: hashedPassword,
      timezone,
      workingHoursStart: startTime,
      workingHoursEnd: endTime
    })

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Error registering user' },
      { status: 500 }
    );
  }
}