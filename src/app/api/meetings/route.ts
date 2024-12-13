import { db } from '@/db';
import { meetings, meetingParticipants } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, desc, or, exists, and } from 'drizzle-orm';
import { verifyToken } from '@/utils/jwt';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, description, startTime, endTime, participants } = await request.json();
    const organizerId = payload.userId;

    // Create meeting
    const [meeting] = await db.insert(meetings)
      .values({
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        organizerId,
      })
      .returning();

    // Add participants
    if (participants && participants.length > 0) {
      await db.insert(meetingParticipants)
        .values(
          participants.map(userId => ({
            meetingId: meeting.id,
            userId,
            status: 'pending'
          }))
        );
    }

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Error creating meeting' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get meetings where user is organizer or participant
    const userMeetings = await db.query.meetings.findMany({
      where: or(
        eq(meetings.organizerId, payload.userId),
        exists(
          db.select()
            .from(meetingParticipants)
            .where(and(
              eq(meetingParticipants.meetingId, meetings.id),
              eq(meetingParticipants.userId, payload.userId)
            ))
        )
      ),
      orderBy: [desc(meetings.startTime)],
    });

    return NextResponse.json(userMeetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Error fetching meetings' },
      { status: 500 }
    );
  }
}