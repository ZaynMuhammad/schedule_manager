import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Meeting {
  id: string
  title: string
  startTime: Date
  endTime: Date
  timezone: string
}

interface MeetingsState {
  meetings: Meeting[]
  loading: boolean
  error: string | null
}

export const createMeeting = createAsyncThunk(
  'meetings/createMeeting',
  async (meeting: {
    title: string;
    startTime: Date;
    endTime: Date;
    timezone: string;
    participants: string[];
  }) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(meeting),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        error: data.error || 'Failed to create meeting',
        status: response.status
      };
    }
    
    return data;
  }
)

export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/meetings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }
    return response.json();
  }
)

export const deleteMeeting = createAsyncThunk(
  'meetings/delete',
  async (meetingId: string) => {
    const response = await fetch(`/api/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete meeting');
    }

    return meetingId;
  }
);

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState: { meetings: [], loading: false, error: null } as MeetingsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.meetings = action.payload
        state.loading = false
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.error = action.error.message || null
        state.loading = false
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.meetings.push(action.payload);
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.meetings = state.meetings.filter(meeting => meeting.id !== action.payload);
      });
  }
})

export default meetingsSlice.reducer 