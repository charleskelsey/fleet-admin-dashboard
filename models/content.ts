
import mongoose, { Schema } from 'mongoose';

const contentSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true, 
    },
    author: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'draft',
      required: true,
    },

  },
  {
    timestamps: true
  }
);

const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);

export default Content;