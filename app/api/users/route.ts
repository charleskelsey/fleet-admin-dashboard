import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from 'next/server';

// Create new User
export async function POST(request: NextRequest) {
    const { name, role } = await request.json();

    await connectMongoDB();
    await User.create(name, role);
    return NextResponse.json({ message: "User Created" }, { status: 201 });
}

// Read all users
export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json({ users });
}

// Delete user
export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");

    await connectMongoDB();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User Deleted" }, { status: 200 });
}