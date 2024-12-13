import { User } from '@/business-logic/types';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export function findAvailableSlots(
  participants: User[],
  date: Date,
  duration: number
): Date[] {
  const slots: Date[] = [];
  
  // Convert everyone's working hours to UTC for comparison
  const availabilities = participants.map(user => ({
    start: zonedTimeToUtc(
      `${date.toISOString().split('T')[0]}T${user.workingHoursStart}`,
      user.timezone
    ),
    end: zonedTimeToUtc(
      `${date.toISOString().split('T')[0]}T${user.workingHoursEnd}`,
      user.timezone
    )
  }));
  
  // Find overlapping time slots
  // Implementation details...
  
  return slots;
} 