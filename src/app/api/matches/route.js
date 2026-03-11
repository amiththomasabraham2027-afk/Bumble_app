import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Match from '@/models/Match';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find matches where the user is a participant
    const matches = await Match.find({ users: currentUser._id })
      .populate('users', 'firstName name imageUrls email')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ matches });

  } catch (error) {
    console.error('Matches error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
