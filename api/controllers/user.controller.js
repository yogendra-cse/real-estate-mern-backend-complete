import bcrypt from "bcryptjs";

import User from "../models/schemas.js";
import SavedPost from "../models/savedPostModel.js";
import Post from "../models/postModel.js";
// import { SavedPost } from '../models/SavedPost.js';
// import { Post } from '../models/Post.js';
// import { Chat } from '../models/Chat.js';
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

//   export const updateUser = async (req, res) => {
//     const id = req.params.id;
//     const tokenUserId = req.userId;
//     console.log("hello");
//     console.log(id);
//     console.log(tokenUserId);

//     const { password, avatar, ...inputs } = req.body;
//     console.log(inputs);

//     // // Ensure user can only update their own profile
//     // if (id.toString() !== tokenUserId.toString()) {
//     //     return res.status(403).json({ message: 'Not Authorized!' });
//     // }

//     try {
//         let updatedData = { ...inputs };

//         if (password) {
//             updatedData.password = await bcrypt.hash(password, 10);
//         }
//         if (avatar) {
//             updatedData.avatar = avatar;
//         }

//         const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found!' });
//         }

//         const { password: userPassword, ...rest } = updatedUser.toObject();
//         res.status(200).json({rest});
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Failed to update user!' });
//     }
// };

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  console.log("User ID from params:", id);
  console.log("Token User ID:", tokenUserId);

  const { password, avatar, ...inputs } = req.body;
  console.log("Received update data:", inputs, "Avatar:", avatar);

  try {
    let updatedData = { ...inputs };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    if (Array.isArray(avatar)) updatedData.avatar = avatar[0];
    else if (avatar) updatedData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    console.log("Updated user data:", updatedUser);

    const { password: userPassword, ...rest } = updatedUser.toObject();
    res.status(200).json(rest); // ✅ Return full user object, not { rest }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;
  // console.log("post ID from params:", postId);
  // console.log("Token User ID:", tokenUserId);
  if (!postId || !tokenUserId) {
    return res
      .status(400)
      .json({ message: "User ID and Post ID are required." });
  }

  try {
    const existingSavedPost = await SavedPost.findOne({
      user: tokenUserId,
      post: postId,
    });

    if (existingSavedPost) {
      await SavedPost.findByIdAndDelete(existingSavedPost._id);
      return res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await SavedPost.create({ user: tokenUserId, post: postId });
      return res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error("Error saving post:", err);
    res
      .status(500)
      .json({ message: "Failed to save post!", error: err.message });
  }
};

export const profilePosts = async (req, res) => {
  //   const tokenUserId = req.userId;
  //  console.log("hello",tokenUserId);

  //   try {
  //     const userPosts = await Post.find({ userId: tokenUserId });
  //     const savedPosts = await SavedPost.find({ userId: tokenUserId }).populate('post');

  //     res.status(200).json({
  //       userPosts,
  //       savedPosts: savedPosts.map((item) => item.post),
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: 'Failed to get profile posts!' ,error:err.message});
  //   }
  //
  const tokenUserId = req.userId;
  console.log("hello", tokenUserId);

  try {
    // Fetch user's own posts
    const userPosts = await Post.find({ user: tokenUserId });

    // Fetch saved posts and populate the 'post' field
    const savedPosts = await SavedPost.find({ user: tokenUserId }).populate(
      "post"
    );

    res.status(200).json({
      userPosts,
      savedPosts:
        savedPosts.length > 0 ? savedPosts.map((item) => item.post) : [],
    });
  } catch (err) {
    console.error("Error fetching profile posts:", err);
    res
      .status(500)
      .json({ message: "Failed to get profile posts!", error: err.message });
  }
};

// SavedPost.createIndexes({ user: 1, post: 1 });

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const unreadCount = await Chat.countDocuments({
      userIDs: tokenUserId,
      seenBy: { $ne: tokenUserId },
    });
    res.status(200).json(unreadCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get notification number!" });
  }
};

export const savedPosts = async (req, res) => {
  try {
    const savedPosts = await SavedPost.find({ user: req.userId }).populate(
      "post"
    );
    res.status(200).json(savedPosts);
  } catch (err) {
    console.error("Error fetching saved posts:", err);
    res.status(500).json({ message: "Failed to fetch saved posts" });
  }
};
