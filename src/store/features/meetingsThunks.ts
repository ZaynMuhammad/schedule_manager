import { createAsyncThunk } from '@reduxjs/toolkit';
import { isWithinWorkingHours } from '@/utils/timeValidation';

interface MeetingPayload {
  title: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  participants: string[];
}

export const scheduleMeeting = createAsyncThunk<void, MeetingPayload>(
  'meetings/scheduleMeeting',
  async (meeting) => {
    const { title, startTime, endTime, participants, timezone } = meeting;
    
    // Validate against all participants' working hours
    const participantsResponse = await fetch('/api/users/validate-hours', {
      method: 'POST',
      body: JSON.stringify({ participants, startTime, endTime })
    });
    
    const validation = await participantsResponse.json();
    if (!validation.isValid) {
      throw new Error(validation.reason);
    }
    
    // Create meeting if validation passes
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(meeting)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return await response.json();
  }
); 