import connectMongoDB from "@/lib/mongodb";
import Reward from "@/models/rewards";
import { NextResponse, NextRequest } from 'next/server';

/**
 * @swagger
 * /api/rewards:
 *   post:
 *     summary: Create a new reward
 *     description: Creates a new reward with the provided details
 *     tags:
 *       - Rewards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - pointsRequired
 *               - status
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the reward
 *               description:
 *                 type: string
 *                 description: Detailed description of the reward
 *               pointsRequired:
 *                 type: number
 *                 description: Points required to redeem the reward
 *               status:
 *                 type: string
 *                 description: Current status of the reward
 *               category:
 *                 type: string
 *                 description: Category of the reward
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration date of the reward (optional)
 *     responses:
 *       201:
 *         description: Reward created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reward Created
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
  try {
    // Extract the fields from the request body
    const { name, description, pointsRequired, status, category, expirationDate } = await request.json();

    // Validate the required fields
    if (!name || !description || pointsRequired === undefined || !status || !category || !expirationDate) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Create the new reward
    const newReward = new Reward({
      name,
      description,
      pointsRequired,
      status,
      category,
      expirationDate,
    });

    // Save the new reward to the database
    const savedReward = await newReward.save();

    return NextResponse.json(
      { message: "Reward created successfully", reward: savedReward },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to create reward" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/rewards:
 *   get:
 *     summary: Retrieve all rewards
 *     description: Fetches all rewards from the database
 *     tags:
 *       - Rewards
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rewards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the reward
 *                       description:
 *                         type: string
 *                         description: Detailed description of the reward
 *                       pointsRequired:
 *                         type: number
 *                         description: Points required to redeem the reward
 *                       status:
 *                         type: string
 *                         description: Current status of the reward
 *                       category:
 *                         type: string
 *                         description: Category of the reward
 *                       expirationDate:
 *                         type: string
 *                         format: date-time
 *                         description: Expiration date of the reward
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
export async function GET() {
  try {
    await connectMongoDB();

    const rewards = await Reward.find();
    if (rewards)
      return NextResponse.json({ rewards }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/rewards:
 *   delete:
 *     summary: Delete a reward
 *     description: Deletes a reward with the specified ID
 *     tags:
 *       - Rewards
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reward to delete
 *     responses:
 *       200:
 *         description: Reward deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reward Deleted
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
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  try {
    await connectMongoDB();
    await Reward.findByIdAndDelete(id);

    return NextResponse.json({ message: "Reward Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
