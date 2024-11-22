import connectMongoDB from "@/lib/mongodb";
import Content from "@/models/content";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/content/{id}:
 *   put:
 *     summary: Update a content item
 *     description: Updates an existing content item with the specified ID
 *     tags:
 *       - Content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newTitle:
 *                 type: string
 *                 description: The new title of the content item
 *               newDescription:
 *                 type: string
 *                 description: The new description of the content item
 *               newType:
 *                 type: string
 *                 description: The new type of the content item (e.g., article, video)
 *               newAuthor:
 *                 type: string
 *                 description: The new author of the content item
 *               newStatus:
 *                 type: string
 *                 description: The new publication status of the content item
 *               newScheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: The new scheduled date for publishing
 *     responses:
 *       200:
 *         description: Content item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content updated
 *       409:
 *         description: Conflict - Content not found or version mismatch
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
 *                   example: Content not found or version mismatch
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const {
      newTitle: title,
      newDescription: description,
      newType: type,
      newAuthor: author,
      newStatus: status
    } = await request.json();

    await connectMongoDB();
    const updatedContent = await Content.findByIdAndUpdate(id, {
      title,
      description,
      type,
      author,
      status
    });

    if (!updatedContent)
      return NextResponse.json(
        { success: false, message: "Content not found or version mismatch" },
        { status: 409 });

    return NextResponse.json({ message: "Content updated" }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: error },
      { status: 409 });
  }
}

/**
 * @swagger
 * /api/content/{id}:
 *   get:
 *     summary: Retrieve a specific content item
 *     description: Fetches a content item with the specified ID from the database
 *     tags:
 *       - Content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content item to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the content item
 *                     title:
 *                       type: string
 *                       description: The title of the content item
 *                     description:
 *                       type: string
 *                       description: Detailed description of the content item
 *                     type:
 *                       type: string
 *                       description: Type of content (e.g., article, video)
 *                     author:
 *                       type: string
 *                       description: Author of the content item
 *                     status:
 *                       type: string
 *                       description: Publication status of the content item
 *                     scheduledDate:
 *                       type: string
 *                       format: date-time
 *                       description: Scheduled publication date
 *       404:
 *         description: Content item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: could not find content item
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await connectMongoDB();
  const content = await Content.findOne({ _id: id });

  if (!content)
    return NextResponse.json(
      { message: "could not find content item" },
      { status: 404 });

  return NextResponse.json({ content }, { status: 200 });
}
