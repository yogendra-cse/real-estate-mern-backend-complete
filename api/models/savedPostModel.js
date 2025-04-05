// Saved Post Schema
import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;


const savedPostSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    post: { type: Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  savedPostSchema.index({ user: 1, post: 1 }, { unique: true });
  
  const SavedPost = model("SavedPost", savedPostSchema);

  export default SavedPost;