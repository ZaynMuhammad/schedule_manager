import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { meetings } from '../schema';

export async function up(db: any) {
  await db.schema.alterTable('meetings').addColumn(
    'timezone',
    text('timezone').notNull().default(sql`'America/New_York'`)
  );
}

export async function down(db: any) {
  await db.schema.alterTable('meetings').dropColumn('timezone');
} 