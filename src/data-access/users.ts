import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { UserId } from '@/business-logic/types';

export async function getUser(userId: UserId) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  
    return user;
}
  