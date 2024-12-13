import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Meeting {
  id: string
  title: string
  startTime: Date
  endTime: Date
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
    return response.json();
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
      });
  }
})

export default meetingsSlice.reducer 