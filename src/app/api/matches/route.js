import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Match from '@/models/Match';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find matches where the user is a participant
    const matches = await Match.find({ users: payload.userId })
      .populate('users', 'name imageUrls')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ matches });

  } catch (error) {
    console.error('Matches error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
