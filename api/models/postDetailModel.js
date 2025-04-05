import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

// Post Detail Schema
const postDetailSchema = new Schema({
    desc: { type: String, required: true },
    utilities: { type: String },
    pet: { type: String },
    income: { type: String },
    size: { type: Number },
    school: { type: Number },
    bus: { type: Number },
    restaurant: { type: Number },
    post: { type: Types.ObjectId, ref: "Post", required: true, unique: true },
  });
  
  const PostDetail = model("PostDetail", postDetailSchema);
  
  export default PostDetail;