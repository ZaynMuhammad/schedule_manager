import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { UserId, User } from '@/business-logic/types';

export async function createUser({ 
  email, 
  username,
  password,
  timezone = 'UTC'  // Default timezone
}: User) {
  const [newUser] = await db.insert(users)
    .values({
      email,
      username,
      password,
      timezone,
    })
    .returning();
  
  return newUser;
}

export async function getUser(userId: UserId) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user;
}
  