import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserId } from '@/business-logic/types'

interface UserState {
  currentUser: User | null
  token: string | null
  loading: boolean
  error: string | null
  workingHours: { startTime: string; endTime: string }
}

const initialState: UserState = {
  currentUser: null,
  token: null,
  loading: false,
  error: null,
  workingHours: { startTime: '09:00', endTime: '17:00' }
}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: UserId) => {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) {
      throw new Error('User not found')
    }
    return response.json()
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
    },
    clearUser: (state) => {
      state.currentUser = null
      state.token = null
      localStorage.removeItem('token')
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch user'
      })
  },
})

export const { setUser, clearUser, setError } = userSlice.actions
export default userSlice.reducer 