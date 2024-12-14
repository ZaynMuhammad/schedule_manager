import { db } from '@/db';
import { meetingParticipants, meetings } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Meeting {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    timezone: string;
    organizerId: string;
  }  

export async function deleteMeeting(meetingId: string) {
  // First delete all participants
  await db.delete(meetingParticipants)
    .where(eq(meetingParticipants.meetingId, meetingId));

    // Then delete the meeting
    const [deletedMeeting] = await db.delete(meetings)
    .where(eq(meetings.id, meetingId))
    .returning();

    return deletedMeeting;
}

export async function createMeeting(meeting: Meeting) {
  const [newMeeting] = await db.insert(meetings)
    .values({
      title: meeting.title,
      description: meeting.description,
      startTime: new Date(meeting.startTime),
      endTime: new Date(meeting.endTime),
      timezone: meeting.timezone,
      organizerId: meeting.organizerId,
    })
    .returning();

  return newMeeting;
}

export async function addParticipants(meetingId: string, participants: string[]) {
    if (participants && participants.length > 0) {
        await db.insert(meetingParticipants)
          .values(
            participants.map(userId => ({
              meetingId,
              userId,
              status: 'pending'
            }))
          );
      }
      return true;
}