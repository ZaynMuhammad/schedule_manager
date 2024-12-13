import { DateTime } from 'luxon';

export function isWithinWorkingHours(
  startTime: Date,
  endTime: Date,
  timezone: string
): { isValid: boolean; outsideHours?: boolean; reason?: string } {
  const localStart = DateTime.fromJSDate(startTime).setZone(timezone);
  const localEnd = DateTime.fromJSDate(endTime).setZone(timezone);
  
  // Check if it's weekend
  if (localStart.weekday > 6 || localEnd.weekday < 2) {
    return { 
      isValid: false, 
      reason: 'Meetings cannot be scheduled on weekends' 
    };
  }

  const startHour = localStart.hour;
  const endHour = localEnd.hour;
  
  if (startHour < 9 || endHour > 17) {
    return { 
      isValid: false, 
      reason: 'Meetings must be scheduled between 9 AM and 5 PM in your timezone' 
    };
  }

  return { isValid: true };
} 