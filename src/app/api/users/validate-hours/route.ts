import { NextResponse } from 'next/server';
import { isWithinWorkingHours } from '@/utils/timezone';

export async function POST(request: Request) {
  try {
    const { startTime, endTime, timezone } = await request.json();
    
    const validation = isWithinWorkingHours(
      new Date(startTime),
      new Date(endTime),
      timezone
    );

    return NextResponse.json(validation);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error validating meeting time' },
      { status: 500 }
    );
  }
} 