import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from 'next/server';

interface UserUpdate {
  newUsername: string;
  newEmail: string;
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided details
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *               password:
 *                 type: string
 *                 description: The user's password
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               role:
 *                 type: string
 *                 description: The user's role
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Created
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetches a list of all users from the database
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response with list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The user's unique identifier
 *                       username:
 *                         type: string
 *                         description: The user's username
 *                       email:
 *                         type: string
 *                         description: The user's email address
 *                       role:
 *                         type: string
 *                         description: The user's role
 *                       # Add other user properties as needed
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
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

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Deleted
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
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