import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'new';

    await connectToDatabase();
    
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 'everyone' = all users except self; 'new' = only unswiped users
    const excludeIds = filter === 'everyone'
      ? [currentUser._id]
      : [
          currentUser._id,
          ...(currentUser.liked || []),
          ...(currentUser.passed || []),
        ];

    const query = {
      _id: { $nin: excludeIds },
      isActive: { $ne: false },
      isAllowed: { $ne: false },
    };

    // Limit to 20 profiles at a time for the deck
    const potentialMatches = await User.find(query).limit(20);

    return NextResponse.json(potentialMatches);

  } catch (error) {
    console.error('Discover Users API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
