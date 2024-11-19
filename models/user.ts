import mongoose, { Schema } from 'mongoose';

export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      match: [/[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}/, 'Please enter a valid email address'],
      unique: true,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;