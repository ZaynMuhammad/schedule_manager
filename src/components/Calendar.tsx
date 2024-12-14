'use client';

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchMeetings, createMeeting, deleteMeeting } from '@/store/features/meetingsSlice'
import { Calendar as BigCalendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar'
import { format as formatDate } from 'date-fns'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Calendar.css'
import MeetingModal from './MeetingModal'


const localizer = dateFnsLocalizer({
  format: formatDate,
  parse,
  startOfWeek,
  getDay,
  locales: ['en-US']
})

interface CalendarProps {
  userTimezone: string;
}

export default function CalendarView({ userTimezone }: CalendarProps) {
  const dispatch = useAppDispatch();
  const { meetings, loading } = useAppSelector((state) => state.meetings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchMeetings());
  }, [dispatch]);

  const handleSelect = (slotInfo: SlotInfo) => {
    setSelectedSlot({
      start: new Date(slotInfo.start),
      end: new Date(slotInfo.end)
    });
    setIsModalOpen(true);
  };

  const handleCreateMeeting = async (title: string, participants: string[]) => {
    if (selectedSlot) {
      console.log("start: ", selectedSlot.start)
      console.log("end: ", selectedSlot.end)
      const meetingPayload = {
        title,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        timezone: userTimezone,
        participants
      };
      
      await dispatch(createMeeting(meetingPayload));
      setIsModalOpen(false);
    }
  };

  const handleSelectEvent = (event: any) => {
    const confirmed = window.confirm('Do you want to delete this meeting?');
    if (confirmed) {
      dispatch(deleteMeeting(event.id));
    }
  };

  const events = meetings.map(meeting => ({
    id: meeting.id,
    title: meeting.title,
    start: new Date(meeting.startTime),
    end: new Date(meeting.endTime),
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
        onSelectEvent={handleSelectEvent}
        date={currentDate}
        onNavigate={date => setCurrentDate(date)}
        formats={{
          timeGutterFormat: (date: Date) => formatDate(date, 'HH:mm'),
          eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${formatDate(start, 'HH:mm')} - ${formatDate(end, 'HH:mm')}`,
        }}
        toolbar={true}
        views={['week']}
      />
      {selectedSlot && (
        <MeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateMeeting}
          startTime={selectedSlot.start}
          endTime={selectedSlot.end}
          userTimezone={userTimezone}
        />
      )}
    </div>
  );
}