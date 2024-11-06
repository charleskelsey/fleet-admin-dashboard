import mongoose, { Schema } from 'mongoose';

enum Role {
  User,
  Admin
}

const userSchema = new Schema(
  {
    id: String,
    username: String,
    password: String,
    email: String,
    role: Role
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;