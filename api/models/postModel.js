import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    type: { type: String, enum: ["buy", "rent"], required: true },
    property: { type: String, enum: ["apartment", "house", "condo", "land"], required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: Types.ObjectId, ref: "User", required: true },
    postDetail: { type: Types.ObjectId, ref: "PostDetail" },
    savedPosts: [{ type: Types.ObjectId, ref: "SavedPost" }],
  });
  
  const Post = model("Post", postSchema);
  export default Post;