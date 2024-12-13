import { db } from '@/db';
import { users } from '@/db/schema';
import { compare } from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createToken } from '@/utils/jwt';

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: or(
        eq(users.email, identifier),
        eq(users.username, identifier)
      ),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { password: _password, ...userWithoutPassword } = user;
    const token = createToken(user.id);

    return NextResponse.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error during login' },
      { status: 500 }
    );
  }
} 