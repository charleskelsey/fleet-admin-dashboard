import connectMongoDB from "@/lib/mongodb";
import Reward from "@/models/rewards";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/rewards/{id}:
 *   put:
 *     summary: Update a reward
 *     description: Updates an existing reward with the specified ID
 *     tags:
 *       - Rewards
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reward to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *                 description: The new name of the reward
 *               newDescription:
 *                 type: string
 *                 description: The new description of the reward
 *               newPointsRequired:
 *                 type: number
 *                 description: The new points required for the reward
 *               newStatus:
 *                 type: string
 *                 description: The new status of the reward
 *               newCategory:
 *                 type: string
 *                 description: The new category of the reward
 *               newExpirationDate:
 *                 type: string
 *                 format: date-time
 *                 description: The new expiration date of the reward
 *     responses:
 *       200:
 *         description: Reward updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reward updated
 *       409:
 *         description: Conflict - Reward not found or version mismatch
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
 *                   example: Reward not found or version mismatch
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    // Extract the fields from the request body
    const { newName, newDescription, newPointsRequired, newStatus, newCategory, newExpirationDate } = await request.json();

    // Prepare an object with the fields that need to be updated
    const updateFields: any = {};

    if (newName) updateFields.name = newName;
    if (newDescription) updateFields.description = newDescription;
    if (newPointsRequired || newPointsRequired === 0) updateFields.pointsRequired = newPointsRequired; // allow zero as a valid input
    if (newStatus) updateFields.status = newStatus;
    if (newCategory) updateFields.category = newCategory;
    if (newExpirationDate) updateFields.expirationDate = newExpirationDate;

    // Connect to MongoDB and update the reward
    await connectMongoDB();
    const updatedReward = await Reward.findByIdAndUpdate(
      id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedReward) {
      return NextResponse.json(
        { success: false, message: "Reward not found or version mismatch" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Reward updated successfully", reward: updatedReward },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to update reward" },
      { status: 500 }
    );
  }
}



/**
 * @swagger
 * /api/rewards/{id}:
 *   get:
 *     summary: Retrieve a specific reward
 *     description: Fetches a reward with the specified ID from the database
 *     tags:
 *       - Rewards
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reward to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reward:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the reward
 *                     name:
 *                       type: string
 *                       description: The name of the reward
 *                     description:
 *                       type: string
 *                       description: Detailed description of the reward
 *                     pointsRequired:
 *                       type: number
 *                       description: Points required to redeem the reward
 *                     status:
 *                       type: string
 *                       description: Current status of the reward
 *                     category:
 *                       type: string
 *                       description: Category of the reward
 *                     expirationDate:
 *                       type: string
 *                       format: date-time
 *                       description: Expiration date of the reward
 *       404:
 *         description: Reward not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: could not find reward
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: String }> }) {
  const { id } = await context.params;

  await connectMongoDB();
  const reward = await Reward.findOne({ _id: id });

  if (!reward)
    return NextResponse.json(
      { message: "could not find reward" },
      { status: 404 });

  return NextResponse.json({ reward }, { status: 200 });
}
