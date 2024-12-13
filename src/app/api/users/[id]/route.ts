import { getUser, createUser } from '@/data-access/users'
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

export async function POST(request: Request) {
  const { userId } = await auth();
  
  // Ensure request is authenticated
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { email, username, timezone } = await request.json()

  const user = await createUser({
    email,
    username,
    timezone,
    password: ''
  })

  return NextResponse.json(user)
}