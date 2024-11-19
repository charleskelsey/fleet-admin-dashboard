import mongoose, { Schema } from 'mongoose';

const ticketSchema = new Schema(
  {
    subject: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['assigned', 'pending', 'closed'],
      default: 'assigned',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
      required: true
    },
    assignedUser: {
      type: String,
      enum: ['none', 'mrcharm', 'fungeey', 'deelulu', 'finchrinch', 'bangladesh', 'tanim'],
      default: 'none',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;