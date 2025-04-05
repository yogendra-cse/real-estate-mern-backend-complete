import Chat from "../models/chatModel.js";
import User from "../models/schemas.js";
import Message from "../models/messageModel.js";

// Get all chats for a user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Find all chats where the user is a participant
    const chats = await Chat.find({ users: tokenUserId }).populate("users");

    // Attach receiver info
    const formattedChats = chats.map((chat) => {
    //   const receiver = chat.users.find((user) => user._id.toString() !== tokenUserId);
      const receiver = chat.users.find((user) => user._id !== tokenUserId);

      return {
        ...chat._doc,
        receiver: receiver
          ? { id: receiver._id, username: receiver.username, avatar: receiver.avatar }
          : null,
      };
    });

    res.status(200).json(formattedChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// Get a specific chat with messages
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    // Find chat and populate messages
    const chat = await Chat.findOne({ _id: chatId, users: tokenUserId })
      .populate({
        path: "messages",
        options: { sort: { createdAt: "asc" } },
        populate: { path: "userId", select: "username avatar" },
      })
      .populate("users", "username avatar");

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // Mark chat as seen by the user
    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// Create a new chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  try {
    // Check if chat already exists
    let existingChat = await Chat.findOne({ users: { $all: [tokenUserId, receiverId] } });

    if (existingChat) return res.status(200).json(existingChat);

    // Create a new chat
    const newChat = await Chat.create({
      users: [tokenUserId, receiverId],
    });

    res.status(200).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, users: tokenUserId },
      { $addToSet: { seenBy: tokenUserId } }, // Ensures user is only added once
      { new: true } // Returns updated document
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
