import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserId } from '@/business-logic/types'

interface UserState {
  currentUser: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null
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
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.error = null
    },
    clearUser: (state) => {
      state.currentUser = null
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