
import connectMongoDB from "@/lib/mongodb";
import Content from "@/models/content";
import { NextResponse, NextRequest } from 'next/server';

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create a new content item
 *     description: Creates a new content item with the provided details
 *     tags:
 *       - Content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - author
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the content item
 *               description:
 *                 type: string
 *                 description: Detailed description of the content
 *               type:
 *                 type: string
 *                 description: Type of content (e.g., article, video)
 *               author:
 *                 type: string
 *                 description: Author of the content
 *               status:
 *                 type: string
 *                 description: Current status (draft, published, archived)
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date to publish content if scheduled
 *     responses:
 *       201:
 *         description: Content item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content Created
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
/*export async function POST(request: NextRequest) {
  const { title, description, type, author, status } = await request.json();
  console.log({ title, description, type, author, status }); // Log each field

  try {
    console.log("Attempting to connect to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB");
    const newContent = await Content.create({ title, description, type, author, status });

    if (newContent)
      return NextResponse.json({ message: "Content Created" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}*/

export async function POST(request: NextRequest) {
  try {
      const { title, description, type, author } = await request.json();

      if (!title || !description || !type || !author) {
          return NextResponse.json(
              { success: false, message: "All fields are required" },
              { status: 400 }
          );
      }

      await connectMongoDB();

      const newContent = new Content({
          title,
          description,
          type,
          author,
          status: "draft",
      });

      const savedContent = await newContent.save();

      return NextResponse.json(
          { message: "Content created successfully", content: savedContent },
          { status: 201 }
      );
  } catch (error) {
      console.error("Error creating content:", error);
      return NextResponse.json(
          { success: false, message: "Failed to create content" },
          { status: 500 }
      );
  }
}

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Retrieve all content items
 *     description: Fetches all content items from the database
 *     tags:
 *       - Content
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: Title of the content item
 *                       description:
 *                         type: string
 *                         description: Detailed description of the content
 *                       type:
 *                         type: string
 *                         description: Type of content (e.g., article, video)
 *                       author:
 *                         type: string
 *                         description: Author of the content
 *                       status:
 *                         type: string
 *                         description: Publication status
 *                       scheduledDate:
 *                         type: string
 *                         format: date-time
 *                         description: Scheduled publication date
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
    const content = await Content.find();

    if (content)
      return NextResponse.json({ content }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/content:
 *   delete:
 *     summary: Delete a content item
 *     description: Deletes a content item with the specified ID
 *     tags:
 *       - Content
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to delete
 *     responses:
 *       200:
 *         description: Content item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content Deleted
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
    await Content.findByIdAndDelete(id);

    return NextResponse.json({ message: "Content Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
