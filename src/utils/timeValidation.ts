import { DateTime } from 'luxon';

export function isWithinWorkingHours(
  startTime: Date,
  user: { workingHoursStart: string; workingHoursEnd: string },
  timezone: string,
): { isValid: boolean; reason?: string } {
  const localStart = DateTime.fromJSDate(startTime).setZone(timezone);
  const [userStartHour] = user.workingHoursStart.split(':').map(Number) || [9];
  const [userEndHour] = user.workingHoursEnd.split(':').map(Number) || [17];
  
  if (localStart.hour < userStartHour || localStart.hour > userEndHour) {
    console.log("Meeting is outside working hours")
    return { 
      isValid: false, 
      reason: 'Meeting is outside working hours' 
    };
  }

  return { isValid: true };
} 