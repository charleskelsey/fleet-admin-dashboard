import mongoose, { Schema } from 'mongoose';

const rewardSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    pointsRequired: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    expirationDate: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Reward = mongoose.models.Reward || mongoose.model("Reward", rewardSchema);

export default Reward;
