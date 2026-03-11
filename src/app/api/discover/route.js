import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
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
    
    const currentUser = await User.findById(payload.userId);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Exclude users already swiped on, and the current user
    const excludeIds = [
      currentUser._id,
      ...currentUser.likedBy,
      ...currentUser.passed,
      // Need to also exclude users the current user HAS liked
      // Actually, wait. The schema says:
      // matches: array of Match ObjectId
      // likedBy: array of User ObjectId
      // passed: array of User ObjectId
      // BUT we need to store who THE CURRENT USER has liked. The PRD says after a Left Swipe (Like), API checks if swiped user has current user in their likedBy.
      // So if User A likes User B, User B's `likedBy` array gets User A added to it.
    ];

    // Find users who haven't rejected us, or already matched (simplification for MVP without complex queries first)
    // Actually, simpler: find users not in the exclude array
    
    // In order to properly exclude users we have already liked, we'd need a `likes` array or query all users where `likedBy` contains our ID
    const usersIveLiked = await User.find({ likedBy: currentUser._id }, '_id');
    const usersIveLikedIds = usersIveLiked.map(u => u._id);
    
    const finalExcludeIds = [...excludeIds, ...usersIveLikedIds];

    const profiles = await User.find({
      _id: { $nin: finalExcludeIds },
      isActive: true, // Only show active users
      // ToDo: add gender/orientation filtering here when implementing settings
    })
    .select('_id name age bio imageUrls gender location') // Exclude sensitive info
    .limit(10); // Batch size 10

    return NextResponse.json({ profiles });

  } catch (error) {
    console.error('Discover error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
