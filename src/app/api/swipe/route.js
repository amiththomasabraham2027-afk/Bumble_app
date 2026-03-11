import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Match from '@/models/Match';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, direction } = await request.json();

    if (!targetUserId || !['left', 'right'].includes(direction)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await connectToDatabase();
    
    const currentUser = await User.findOne({ email: session.user.email });
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let isMatch = false;

    if (direction === 'right') {
      // Pass
      await User.findByIdAndUpdate(currentUser._id, {
        $addToSet: { passed: targetUser._id }
      });
      return NextResponse.json({ message: 'Passed', match: false });
    } 
    
    if (direction === 'left') {
      // Like — track in both directions
      await User.findByIdAndUpdate(currentUser._id, {
        $addToSet: { liked: targetUser._id }
      });
      await User.findByIdAndUpdate(targetUser._id, {
        $addToSet: { likedBy: currentUser._id }
      });

      // Check for mutual like: did targetUser already like currentUser?
      // Does currentUser's likedBy array contain targetUser._id?
      if (currentUser.likedBy.includes(targetUser._id)) {
        isMatch = true;

        // Mutual like! Create match.
        // PRD: initiator based on who liked first. The second liker initiates.
        // In this case, targetUser liked first, currentUser liked second.
        // Therefore, currentUser is the initiator.
        
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const newMatch = await Match.create({
          users: [currentUser._id, targetUser._id],
          initiator: currentUser._id,
          expiresAt,
        });

        // Add match ref to both users
        await User.updateMany(
          { _id: { $in: [currentUser._id, targetUser._id] } },
          { $addToSet: { matches: newMatch._id } }
        );

        return NextResponse.json({ message: 'It\'s a match!', match: true, matchData: newMatch });
      }

      return NextResponse.json({ message: 'Liked', match: false });
    }

  } catch (error) {
    console.error('Swipe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
