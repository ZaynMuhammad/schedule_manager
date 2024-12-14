import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { UserId, User } from '@/business-logic/types';

export async function createUser({ 
  email, 
  username,
  password,
  timezone = 'UTC',
  workingHoursStart,
  workingHoursEnd
}: User) {
  const [newUser] = await db.insert(users)
    .values({
      email,
      username,
      password,
      timezone,
      workingHoursStart,
      workingHoursEnd,
    })
    .returning();
  
  return newUser;
}

export async function getUserById(userId: UserId) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  
    return user;
}

export async function getUserByEmailOrUsername(identifier: string) {
  const user = await db.query.users.findFirst({
    where: or(
      eq(users.email, identifier),
      eq(users.username, identifier)
    ),
  });
  return user;
}

export async function getAllUsers() {
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      username: true,
      email: true,
      timezone: true,
      workingHoursStart: true,
      workingHoursEnd: true
    },
  })

  return users;
}