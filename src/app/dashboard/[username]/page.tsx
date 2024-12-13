'use client'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { clearUser } from '@/store/features/userSlice'
import Calendar from '@/components/Calendar'
import { useParams } from 'next/navigation'

export default function DashboardPage() {
  const user = useAppSelector((state) => state.user.currentUser)
  const dispatch = useAppDispatch()
  const params = useParams()
  const username = params.username

  if (user?.username !== username) {
    return <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-black">Unauthorized access</h1>
    </div>
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <p className="text-white"><span className="font-bold">Name:</span> {user?.username}</p>
          <p className="text-white"><span className="font-bold">Email:</span> {user?.email}</p>
          <p className="text-white"><span className="font-bold">Timezone:</span> {user?.timezone}</p>
        </div>
        <button 
          onClick={() => dispatch(clearUser())}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>
      {user && <Calendar userTimezone={user.timezone || 'UTC'} />}
    </div>
  )
}
