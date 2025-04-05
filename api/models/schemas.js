import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: Types.ObjectId, ref: "Post" }],
  savedPosts: [{ type: Types.ObjectId, ref: "SavedPost" }],
  chats: [{ type: Types.ObjectId, ref: "Chat" }],
});

const User = model("User", userSchema);

export default User;
