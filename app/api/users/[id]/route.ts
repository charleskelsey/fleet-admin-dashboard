import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// Update user (by id)
export async function PUT(request: NextRequest, context: { params: Promise<{ id: String }> }) {
  const { id } = await context.params;

  try {
    const {
      newUsername: username,
      newPassword: password,
      newEmail: email,
      newRole: role } = await request.json();

      await connectMongoDB();
      const updatedUser = await User.findByIdAndUpdate(id, { username, password, email, role });
    
      if (!updatedUser)
        return NextResponse.json(
          { success: false, message: "User not found or version mismatch" },
          { status: 409 });
    
      return NextResponse.json({ message: "User updated" }, { status: 200 });
  }catch(error){
    console.log(error);

    return NextResponse.json(
      { success: false, message: error },
      { status: 409 });
  }
}

// Read user by id
export async function GET(request: NextRequest, context: { params: Promise<{ id: String }> }) {
  const { id } = await context.params;

  await connectMongoDB();
  const user = await User.findOne({ _id: id });

  if (!user)
    return NextResponse.json(
      { message: "could not find user" },
      { status: 404 });

  return NextResponse.json({ user }, { status: 200 });
}