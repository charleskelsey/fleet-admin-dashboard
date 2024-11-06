import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

interface userQuery{
  id?: string;
}

// Update user (by id)
export async function PUT(request: NextRequest, query: userQuery){
  const {id} = query;
  const {newName : name, newRole: role } = await request.json();

  await connectMongoDB();
  await User.findByIdAndUpdate(id, {name, role});
  return NextResponse.json({message: "User updated"}, {status: 200});
}

// Read user (by id)
export async function GET(request: NextRequest, query: userQuery){
  const {id} = query;

  await connectMongoDB();
  const user = await User.findOne({_id:id});
  return NextResponse.json({user}, {status:200});
}