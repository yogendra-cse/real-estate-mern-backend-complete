
import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const chatSchema = new Schema({
    users: [{ type: Types.ObjectId, ref: "User", required: true }],
    createdAt: { type: Date, default: Date.now },
    seenBy: [{ type: Types.ObjectId, ref: "User" }],
    messages: [{ type: Types.ObjectId, ref: "Message" }],
    lastMessage: { type: String },
  });
  
  const Chat = model("Chat", chatSchema);
  export default Chat;