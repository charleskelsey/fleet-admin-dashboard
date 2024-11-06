import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from 'next/server';

interface UserUpdate {
  newUsername: string;
  newEmail: string;
}

// Create new User
export async function POST(request: NextRequest) {
  const { username, password, email, role } = await request.json();

  try {
    await connectMongoDB();
    const newUser = await User.create({ username, password, email, role });

    if (newUser)
      return NextResponse.json({ message: "User Created" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

// Read all users
export async function GET() {
  try {
    await connectMongoDB();

    const users = await User.find();
    if (users)
      return NextResponse.json({ users }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

// Delete user
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  try {
    await connectMongoDB();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "User Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}