'use client'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { clearUser } from '../store/features/userSlice'
import AuthButtons from '@/components/AuthButtons'

export default function Home() {
  const user = useAppSelector((state) => state.user.currentUser)
  const error = useAppSelector((state) => state.user.error)
  const dispatch = useAppDispatch()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>
        {user ? (
          <div className="flex flex items-center gap-4">
            <div className="flex items-center gap-8">
              <p className="text-black"><span className="font-bold">Name:</span> {user.username}</p>
              <p className="text-black"><span className="font-bold">Email:</span> {user.email}</p>
              <p className="text-black"><span className="font-bold">Timezone:</span> {user.timezone}</p>
            </div>
            <button 
              onClick={() => dispatch(clearUser())}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-white">Welcome to Schedule Manager</h1>
            <AuthButtons />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  )
}
