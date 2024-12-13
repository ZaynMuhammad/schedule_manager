import { 
    pgTable, 
    text, 
    timestamp, 
    uuid, 
    varchar 
  } from 'drizzle-orm/pg-core';
  import { sql } from 'drizzle-orm';
  
  export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').unique().notNull(),
    username: text('username').unique().notNull(),
    password: text('password').notNull(),
    timezone: text('timezone').default('UTC'),
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
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    organizerId: uuid('organizer_id')
      .references(() => users.id)
      .notNull(),
  });
  
  export const meetingParticipants = pgTable('meeting_participants', {
    id: uuid('id').defaultRandom().primaryKey(),
    meetingId: uuid('meeting_id')
      .references(() => meetings.id)
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    status: text('status').default('pending'), // 'pending', 'accepted', 'declined'
  });