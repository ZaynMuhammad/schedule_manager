import { toZonedTime, formatInTimeZone } from 'date-fns-tz'
import { DateTime } from 'luxon';

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

export function isWithinWorkingHours(
  startTime: Date,
  endTime: Date,
  timezone: string
): { isValid: boolean; reason?: string } {
  const localStart = DateTime.fromJSDate(startTime).setZone(timezone);
  const localEnd = DateTime.fromJSDate(endTime).setZone(timezone);
  
  // Check if it's weekend
  if (localStart.weekday > 5) {
    return { 
      isValid: false, 
      reason: 'This meeting is scheduled for a weekend.' 
    };
  }

  const startHour = localStart.hour;
  const endHour = localEnd.hour;

  if (startHour < 9 || endHour > 17) {
    return { 
      isValid: false, 
      reason: 'This meeting is outside working hours.' 
    };
  }


  return { isValid: true };
}