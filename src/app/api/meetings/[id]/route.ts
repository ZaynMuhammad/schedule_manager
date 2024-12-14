import { deleteMeeting } from '@/data-access/meetings';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const deletedMeeting = await deleteMeeting(params.id);

    if (!deletedMeeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedMeeting);
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { error: 'Error deleting meeting' },
      { status: 500 }
    );
  }
} 