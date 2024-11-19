import connectMongoDB from "@/lib/mongodb";
import Ticket from "@/models/ticket";
import { NextResponse, NextRequest } from 'next/server';

interface UserUpdate {
  newUsername: string;
  newEmail: string;
}

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     description: Creates a new ticket with the provided details
 *     tags:
 *       - Tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *               - status
 *               - priority
 *               - assignedUser
 *             properties:
 *               subject:
 *                 type: string
 *                 description: The subject of the ticket
 *               description:
 *                 type: string
 *                 description: Detailed description of the ticket
 *               status:
 *                 type: string
 *                 description: Current status of the ticket
 *               priority:
 *                 type: string
 *                 description: Priority level of the ticket
 *               assignedUser:
 *                 type: string
 *                 description: User assigned to the ticket
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket Created
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
  const { subject, description, status, priority, assignedUser } = await request.json();

  try {
    await connectMongoDB();
    const newTicket = await Ticket.create({ subject, description, status, priority, assignedUser });

    if (newTicket)
      return NextResponse.json({ message: "Ticket Created" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}*/

export async function POST(request: NextRequest) {
  try {
      const { subject, description, status = "assigned", priority = "low", assignedUser = "none" } = await request.json();

      if (!subject || !description) {
          return NextResponse.json(
              { success: false, message: "Subject and description are required" },
              { status: 400 }
          );
      }

      await connectMongoDB();

      const newTicket = new Ticket({
          subject,
          description,
          status,
          priority,
          assignedUser,
      });

      const savedTicket = await newTicket.save();

      return NextResponse.json(
          { message: "Ticket created successfully", ticket: savedTicket },
          { status: 201 }
      );
  } catch (error) {
      console.error("Error creating ticket:", error);
      return NextResponse.json(
          { success: false, message: "Failed to create ticket" },
          { status: 500 }
      );
  }
}

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Retrieve all tickets
 *     description: Fetches all tickets from the database
 *     tags:
 *       - Tickets
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subject:
 *                         type: string
 *                         description: The subject of the ticket
 *                       description:
 *                         type: string
 *                         description: Detailed description of the ticket
 *                       status:
 *                         type: string
 *                         description: Current status of the ticket
 *                       priority:
 *                         type: string
 *                         description: Priority level of the ticket
 *                       assignedUser:
 *                         type: string
 *                         description: User assigned to the ticket
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

    const tickets = await Ticket.find();
    if (tickets)
      return NextResponse.json({ tickets }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/tickets:
 *   delete:
 *     summary: Delete a ticket
 *     description: Deletes a ticket with the specified ID
 *     tags:
 *       - Tickets
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to delete
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket Deleted
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
    await Ticket.findByIdAndDelete(id);

    return NextResponse.json({ message: "Ticket Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}