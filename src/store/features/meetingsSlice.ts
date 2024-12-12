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

export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async () => {
    const response = await fetch('/api/meetings')
    if (!response.ok) throw new Error('Failed to fetch meetings')
    return response.json()
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
  }
})

export default meetingsSlice.reducer 