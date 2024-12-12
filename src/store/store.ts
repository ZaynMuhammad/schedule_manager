import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import meetingsReducer from './features/meetingsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    meetings: meetingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 