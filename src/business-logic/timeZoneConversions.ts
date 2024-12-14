import { format } from 'date-fns-tz';
import { DateTime } from 'luxon';
import { User } from '@/business-logic/types';

// Super hacky way to adjust the time for the user's timezone, but it works for now
function adjustTimeForTimeZone(date: Date, timezoneToConvertTo: string, timezoneToConvertFrom: string): Date {
    const currentOffset = DateTime.now().setZone(timezoneToConvertFrom).offset;
    const userOffset = DateTime.now().setZone(timezoneToConvertTo).offset;
    const diffMinutes = userOffset - currentOffset;
    
    return new Date(date.getTime() - (diffMinutes * 60 * 1000));
  }

export function convertTimeIfDifferentTimeZone(user: User, timezone: string, startTime: Date, endTime: Date, currentTimezone: string) {
    if (timezone !== user.timezone) {
        const adjustedStart = adjustTimeForTimeZone(new Date(startTime), currentTimezone, user.timezone);
        const adjustedEnd = adjustTimeForTimeZone(new Date(endTime), currentTimezone, user.timezone);
        
        return `${user.username} (${user.timezone}) - Local time: ${format(adjustedStart, 'HH:mm')} - ${format(adjustedEnd, 'HH:mm')}`
    }
    return `${user.username} (${user.timezone}) - Local time: ${format(new Date(startTime), 'HH:mm')} - ${format(new Date(endTime), 'HH:mm')}`;
  }
