import { 
    pgTable, 
    text, 
    timestamp, 
    uuid, 
    varchar 
  } from 'drizzle-orm/pg-core';
  import { sql } from 'drizzle-orm';
  
  export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    password: text('password').notNull(),
    timezone: varchar('timezone', { length: 50 }).default('UTC').notNull(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  });
  
  export const workingHours = pgTable('working_hours', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    startTime: varchar('start_time', { length: 5 }).notNull(), 
    endTime: varchar('end_time', { length: 5 }).notNull(), 
    workDays: text('work_days').notNull(), // JSON string array of numbers (0-6), maybe use something other than JSON
  });
  
  export const meetings = pgTable('meetings', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    organizerId: uuid('organizer_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  });
  
  export const meetingParticipants = pgTable('meeting_participants', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    meetingId: uuid('meeting_id')
      .notNull()
      .references(() => meetings.id),
    status: varchar('status', { enum: ['accepted', 'pending', 'declined'] }).notNull(),
  });