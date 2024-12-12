'use client';

import Calendar from '@toast-ui/react-calendar';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { RootState } from '@/store/store'
import { fetchMeetings } from '@/store/features/meetingsSlice';
import { formatToTimeZone } from 'date-fns-tz';

interface CalendarProps {
  userTimezone: string;
}

export default function CalendarView({ userTimezone }: CalendarProps) {
  const dispatch = useAppDispatch();
  const { meetings, loading } = useAppSelector((state: RootState) => state.meetings);

  // Can do this in a better way, try react query maybe
  useEffect(() => {
    dispatch(fetchMeetings());
  }, [dispatch]);

  // Mock data for testing, should remove this when db is has data
  const calendarEvents = meetings.map(meeting => ({
    id: meeting.id,
    calendarId: '1',
    title: meeting.title,
    start: formatToTimeZone(meeting.startTime, userTimezone),
    end: formatToTimeZone(meeting.endTime, userTimezone),
    category: 'time',
  }));

  return (
    <div className="h-screen p-4">
      <Calendar
        height="900px"
        view="week"
        events={calendarEvents}
        useCreationPopup={true}
        useDetailPopup={true}
        onBeforeCreateEvent={handleBeforeCreateEvent}
      />
    </div>
  );
}