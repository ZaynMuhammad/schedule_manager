'use client'
import Link from 'next/link'

export default function AuthButtons() {
  return (
    <div className="flex gap-4">
      <Link 
        href="/sign-in"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href="/sign-up"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors"
      >
        Register
      </Link>
    </div>
  )
} 