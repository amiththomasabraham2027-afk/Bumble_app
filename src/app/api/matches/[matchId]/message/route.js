import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Match from '@/models/Match';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { matchId } = params;
    await connectToDatabase();

    const match = await Match.findById(matchId).populate('users', 'name imageUrls');
    if (!match || !match.users.some(u => u._id.toString() === payload.userId)) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ match });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { matchId } = params;
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    await connectToDatabase();

    const match = await Match.findById(matchId);
    if (!match || !match.users.includes(payload.userId)) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Check Bumble-style gating (initiator must message first within 24hr)
    // If messages length is 0, the sender MUST be the initiator.
    if (match.messages.length === 0) {
      if (match.initiator.toString() !== payload.userId) {
        return NextResponse.json({ error: 'The initiator must send the first message.' }, { status: 403 });
      }
      
      // Check expiry
      if (new Date() > match.expiresAt) {
        return NextResponse.json({ error: 'Match has expired' }, { status: 403 });
      }
    }

    // Determine receiver
    const receiverId = match.users.find(id => id.toString() !== payload.userId);

    const newMessage = {
      sender: payload.userId,
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
