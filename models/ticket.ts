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
      required: true
    },
    priority: {
      type: String,
      required: true
    },
    assignedUser: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;