import connectMongoDB from "@/lib/mongodb";
import Ticket from "@/models/ticket";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update a ticket
 *     description: Updates an existing ticket with the specified ID
 *     tags:
 *       - Tickets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newSubject:
 *                 type: string
 *                 description: The new subject of the ticket
 *               newDescription:
 *                 type: string
 *                 description: The new description of the ticket
 *               newStatus:
 *                 type: string
 *                 description: The new status of the ticket
 *               newPriority:
 *                 type: string
 *                 description: The new priority of the ticket
 *               newAssignedUser:
 *                 type: string
 *                 description: The new user assigned to the ticket
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket updated
 *       409:
 *         description: Conflict - Ticket not found or version mismatch
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
 *                   example: Ticket not found or version mismatch
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const {
      newSubject: subject,
      newDescription: description,
      newStatus: status,
      newPriority: priority,
      newAssignedUser: assignedUser
    } = await request.json();

    await connectMongoDB();
    const updatedTicket = await Ticket.findByIdAndUpdate(id, {
      subject,
      description,
      status,
      priority,
      assignedUser
    });

    if (!updatedTicket)
      return NextResponse.json(
        { success: false, message: "Ticket not found or version mismatch" },
        { status: 409 });

    return NextResponse.json({ message: "Ticket updated" }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: error },
      { status: 409 });
  }
}

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Retrieve a specific ticket
 *     description: Fetches a ticket with the specified ID from the database
 *     tags:
 *       - Tickets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ticket to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the ticket
 *                     subject:
 *                       type: string
 *                       description: The subject of the ticket
 *                     description:
 *                       type: string
 *                       description: Detailed description of the ticket
 *                     status:
 *                       type: string
 *                       description: Current status of the ticket
 *                     priority:
 *                       type: string
 *                       description: Priority level of the ticket
 *                     assignedUser:
 *                       type: string
 *                       description: User assigned to the ticket
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: could not find ticket
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await connectMongoDB();
  const ticket = await Ticket.findOne({ _id: id });

  if (!ticket)
    return NextResponse.json(
      { message: "could not find ticket" },
      { status: 404 });

  return NextResponse.json({ ticket }, { status: 200 });
}