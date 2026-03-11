import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Match from '@/models/Match';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { matchId } = await params;
    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const match = await Match.findById(matchId).populate('users', 'firstName name imageUrls email');
    if (!match || !match.users.some(u => u._id.toString() === currentUser._id.toString())) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ match, currentUserId: currentUser._id.toString() });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { matchId } = await params;
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const match = await Match.findById(matchId);
    if (!match || !match.users.some(id => id.toString() === currentUser._id.toString())) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Determine receiver
    const receiverId = match.users.find(id => id.toString() !== currentUser._id.toString());

    const newMessage = {
      sender: currentUser._id,
      receiver: receiverId,
      text: text.trim(),
      read: false,
    };

    match.messages.push(newMessage);
    await match.save();

    return NextResponse.json({ message: 'Message sent', data: newMessage });

  } catch (error) {
    console.error('Message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
