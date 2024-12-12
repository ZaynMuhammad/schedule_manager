import { getUser } from '@/data-access/users'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser(params.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json(user)
} 