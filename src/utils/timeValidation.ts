export function isWithinWorkingHours(
  startTime: Date,
  endTime: Date,
  workingHours: { startTime: string; endTime: string }
): boolean {
  // Check if it's weekend, 0 is Sunday, 6 is Saturday
  const day = startTime.getDay();
  if (day === 0 || day === 6) { 
    return false;
  }

  const meetingStart = startTime.getHours() * 60 + startTime.getMinutes();
  const meetingEnd = endTime.getHours() * 60 + endTime.getMinutes();
  
  const [workStartHour, workStartMinute] = workingHours.startTime.split(':').map(Number);
  const [workEndHour, workEndMinute] = workingHours.endTime.split(':').map(Number);
  
  const workStart = workStartHour * 60 + workStartMinute;
  const workEnd = workEndHour * 60 + workEndMinute;

  return meetingStart >= workStart && meetingEnd <= workEnd;
} 