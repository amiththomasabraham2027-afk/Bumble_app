import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import AllowedEmail from '@/models/AllowedEmail';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, firstName, dob, gender, imageUrls, bio, lookingFor, location } = await request.json();

    if (!email || !password || !firstName || !dob) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is in the allowed list
    const allowed = await AllowedEmail.findOne({ email: normalizedEmail });
    
    if (!allowed || !allowed.isAllowed) {
      return NextResponse.json({ error: 'Your email is not authorized for early access.' }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName,
      name: firstName,
      dob,
      gender,
      imageUrls: imageUrls || [],
      bio: bio || '',
      lookingFor: lookingFor || '',
      location: location || '',
    });

    // Create token
    const token = await signToken({ userId: newUser._id.toString(), email: newUser.email });

    // Set cookie
    const response = NextResponse.json({ message: 'Registration successful', user: { id: newUser._id, email: newUser.email } }, { status: 201 });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error object:', error);
    console.error('Registration error message:', error.message);
    if (error.stack) console.error('Registration stack trace:', error.stack);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
