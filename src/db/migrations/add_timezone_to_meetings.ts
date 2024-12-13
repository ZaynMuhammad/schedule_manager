import { sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';

export async function up(db: any) {
  await db.execute(sql`
    ALTER TABLE meetings 
    ADD COLUMN timezone text NOT NULL DEFAULT 'UTC';
  `);
}

export async function down(db: any) {
  await db.execute(sql`
    ALTER TABLE meetings 
    DROP COLUMN timezone;
  `);
} 