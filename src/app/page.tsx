'use client'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser, clearUser, fetchUser } from '../store/features/userSlice'
import { UserId } from '@/business-logic/types'

export default function Home() {
  const user = useAppSelector((state) => state.user.currentUser)
  const error = useAppSelector((state) => state.user.error)
  const dispatch = useAppDispatch()

  const handleFetchUser = async (userId: UserId) => {
    try {
      await dispatch(fetchUser(userId)).unwrap()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>
        {user ? (
          <div>
            <h1>Welcome, {user.username}!</h1>
            <p>Email: {user.email}</p>
            <p>Timezone: {user.timezone}</p>
            <button 
              onClick={() => dispatch(clearUser())}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <h1>Please log in</h1>
            {/* Add your login form here */}
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  )
}
