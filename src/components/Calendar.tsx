'use client';

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchMeetings, createMeeting } from '@/store/features/meetingsSlice'
import { Calendar as BigCalendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { isWithinWorkingHours } from '@/utils/timeValidation'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Calendar.css'
import MeetingModal from './MeetingModal'
import { toZonedTime } from 'date-fns-tz'

const locales = {
  'en-US': require('date-fns/locale/en-US')
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarProps {
  userTimezone: string;
}

export default function CalendarView({ userTimezone }: CalendarProps) {
  const dispatch = useAppDispatch();
  const { meetings, loading } = useAppSelector((state) => state.meetings);
  const workingHours = useAppSelector((state) => state.user.workingHours);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  useEffect(() => {
    dispatch(fetchMeetings());
  }, [dispatch]);

  const handleSelect = async (slotInfo: SlotInfo) => {
    const day = slotInfo.start.getDay();
    if (day === 0 || day === 6) {
      alert('Meetings cannot be scheduled on weekends');
      return;
    }

    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setIsModalOpen(true);
  };

  const handleCreateMeeting = async (title: string, participants: string[]) => {
    if (selectedSlot) {
      await dispatch(createMeeting({
        title,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        participants
      }));
      setIsModalOpen(false);
    }
  };

  const events = meetings.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    start: toZonedTime(new Date(meeting.startTime), userTimezone),
    end: toZonedTime(new Date(meeting.endTime), userTimezone),
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView="week"
        selectable
        onSelectSlot={handleSelect}
      />
      {selectedSlot && (
        <MeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateMeeting}
          startTime={selectedSlot.start}
          endTime={selectedSlot.end}
        />
      )}
    </div>
  );
}