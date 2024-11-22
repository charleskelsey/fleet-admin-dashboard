import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates a user's information by their ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newUsername:
 *                 type: string
 *                 description: The new username for the user
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 description: The new email for the user
 *               newRole:
 *                 type: string
 *                 description: The new role for the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated
 *       409:
 *         description: Conflict - User not found or version mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found or version mismatch
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Fetches a single user's details from the database using their ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successful response with user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The user's unique identifier
 *                     username:
 *                       type: string
 *                       description: The user's username
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     role:
 *                       type: string
 *                       description: The user's role
 *                     # Add other user properties as needed
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: could not find user
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
// Read user by id
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await connectMongoDB();
  const user = await User.findOne({ _id: id });

  if (!user)
    return NextResponse.json(
      { message: "could not find user" },
      { status: 404 });

  return NextResponse.json({ user }, { status: 200 });
}