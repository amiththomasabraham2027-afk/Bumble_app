import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

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

    // Determine target gender for matching based on current user's gender
    // Assuming heterosexual matching for MV
    const targetGender = currentUser.gender === 'Woman' ? 'Man' : 'Woman';

    // Users to exclude: current user + already swiped (liked or passed)
    const excludeIds = [
      currentUser._id,
      ...(currentUser.likedBy || []),
      ...(currentUser.passed || []),
      ...(currentUser.matches || []) // Already matched users
    ];

    // Build the query
    const query = {
      _id: { $nin: excludeIds },
      gender: targetGender,
      isActive: true,
      isAllowed: true
    };

    // Note: If currentUser.gender is undefined/unspecified (brand new Google account), 
    // we just fetch everyone for now until they finish onboarding
    if (!currentUser.gender || currentUser.gender === 'unspecified') {
       delete query.gender;
    }

    // Limit to 20 profiles at a time for the deck
    const potentialMatches = await User.find(query).limit(20);

    return NextResponse.json(potentialMatches);

  } catch (error) {
    console.error('Discover Users API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
