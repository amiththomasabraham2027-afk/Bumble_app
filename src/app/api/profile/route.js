import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    // Prevent users from changing restricted fields arbitrarily
    const allowedUpdates = {};
    const updatableFields = ['firstName', 'dob', 'bio', 'gender', 'location', 'interests', 'job', 'school', 'imageUrls'];
    
    Object.keys(updates).forEach((key) => {
        if (updatableFields.includes(key)) {
            allowedUpdates[key] = updates[key];
        }
    });

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Profile Update API Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });
    return NextResponse.json(currentUser);
  } catch(e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
