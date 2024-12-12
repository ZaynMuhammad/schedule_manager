import { db } from './index';
import { users, meetings, workingHours, meetingParticipants } from './schema';
import { eq, and, gte, lte } from 'drizzle-orm';

// Insert a new user
async function createUser() {
  const newUser = await db.insert(users).values({
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword', // Remember to hash passwords!
    timezone: 'UTC'
  }).returning();
  
  return newUser[0];
}

// Set user's working hours
async function setWorkingHours(userId: string) {
  return await db.insert(workingHours).values({
    userId,
    startTime: '09:00',
    endTime: '17:00',
    workDays: JSON.stringify([1, 2, 3, 4, 5]) // Monday to Friday
  });
}

// Create a meeting
async function createMeeting(organizerId: string) {
  return await db.insert(meetings).values({
    title: 'Team Sync',
    description: 'Weekly team sync meeting',
    startTime: new Date('2024-03-20T10:00:00Z'),
    endTime: new Date('2024-03-20T11:00:00Z'),
    organizerId
  });
}

// Add participant to meeting
async function addParticipant(userId: string, meetingId: string) {
  return await db.insert(meetingParticipants).values({
    userId,
    meetingId,
    status: 'pending'
  });
}

// Query: Get all meetings for a user (both organized and participating)
async function getUserMeetings(userId: string) {
  return await db.query.meetings.findMany({
    where: or(
      eq(meetings.organizerId, userId),
      eq(meetingParticipants.userId, userId)
    ),
    with: {
      organizer: true,
      participants: {
        with: {
          user: true
        }
      }
    }
  });
}

// Query: Get user's working hours
async function getUserWorkingHours(userId: string) {
  return await db.query.workingHours.findFirst({
    where: eq(workingHours.userId, userId)
  });
}

// Update: Update meeting status
async function updateParticipantStatus(userId: string, meetingId: string, status: string) {
  return await db.update(meetingParticipants)
    .set({ status })
    .where(
      and(
        eq(meetingParticipants.userId, userId),
        eq(meetingParticipants.meetingId, meetingId)
      )
    );
} 