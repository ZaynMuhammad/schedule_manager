import { toZonedTime, formatInTimeZone } from 'date-fns-tz'

export function convertToTimezone(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone)
}

export function validateMeetingTime(
  meetingTime: Date,
  workingHours: { startTime: string; endTime: string } | undefined,
  userTimezone: string
): boolean {
  if (!workingHours) return true;

  // Convert meeting time to user's timezone
  const userLocalTime = formatInTimeZone(meetingTime, userTimezone, 'HH:mm');
  const [meetingHour] = userLocalTime.split(':').map(Number);

  // Extract hours from working hours
  const [startHour] = workingHours.startTime.split(':').map(Number);
  const [endHour] = workingHours.endTime.split(':').map(Number);

  return meetingHour >= startHour && meetingHour < endHour;
}