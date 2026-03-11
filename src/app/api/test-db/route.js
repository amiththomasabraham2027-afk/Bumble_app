import connectToDatabase from "@/lib/db"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test creating a user exactly like NextAuth does
    const res = await User.create({
      email: "test.google.random" + Math.random() + "@example.com",
      name: "Test User",
      firstName: "Test",
      imageUrls: ["http://example.com/image.png"],
      dob: new Date('2000-01-01'),
      gender: 'unspecified',
    });
    
    return NextResponse.json({ success: true, user: res });
  } catch (error) {
    return NextResponse.json({ success: false, errorMessage: error.message, errorStack: error.stack });
  }
}
