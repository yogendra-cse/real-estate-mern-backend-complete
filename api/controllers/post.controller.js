import Post from "../models/postModel.js";
import PostDetail from "../models/postDetailModel.js";
import SavedPost from "../models/savedPostModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Get all posts with filtering

export const getPosts = async (req, res) => {

  
  const { city, type, property, bedroom, minPrice, maxPrice } = req.query;


  try {
    const posts = await Post.find({
      ...(city && { city }),
      ...(type && { type }),
      ...(property && { property }),
      ...(bedroom && { bedroom: parseInt(bedroom) }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { $gte: parseInt(minPrice) }),
              ...(maxPrice && { $lte: parseInt(maxPrice) }),
            },
          }
        : {}),
    }).populate("user", "username avatar");

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get a single post by ID

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id)
      .populate("postDetail")
      .populate("user", "username avatar");

    if (!post) return res.status(404).json({ message: "Post not found" });

    let isSaved = false;
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, "my_secret", async (err, payload) => {
        if (!err) {
          const saved = await SavedPost.findOne({ postId: id, userId: payload.id });
          isSaved = !!saved;
        }
        res.status(200).json({ ...post.toObject(), isSaved ,message:"post successfully retrived"});
      });
    } else {
      res.status(200).json({ ...post.toObject(), isSaved });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Add a new post

export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const userId = req.userId;

  try {
    // First, create the post without postDetail
    const newPost = await Post.create({ ...postData, user: userId });

    // Then, create the postDetail with the newly created post's ID
    const newPostDetail = await PostDetail.create({ ...postDetail, post: newPost._id });

    // Update the post to include the postDetail ID
    newPost.postDetail = newPostDetail._id;
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};
//  update a post

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    let updatedPostDetail;

    // Check if postDetail exists and has a valid ObjectId
    if (updates.postDetail && updates.postDetail._id) {
      const postDetailId = updates.postDetail._id;

      // Ensure postDetailId is a valid 24-character hex string before converting
      if (typeof postDetailId === "string" && mongoose.Types.ObjectId.isValid(postDetailId)) {
        updatedPostDetail = await PostDetail.findByIdAndUpdate(
          postDetailId,
          updates.postDetail,
          { new: true }
        );
      } else {
        return res.status(400).json({ message: "Invalid postDetail _id" });
      }
    } else if (updates.postDetail) {
      // Create a new postDetail if no valid _id exists
      updatedPostDetail = new PostDetail(updates.postDetail);
      await updatedPostDetail.save();
    }

    // Assign the postDetail ObjectId to the post update
    if (updatedPostDetail) {
      updates.postDetail = updatedPostDetail._id;
    }

    // Validate if `id` is a valid ObjectId before updating
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post _id" });
    }

    // Update the main post document
    const updatedPost = await Post.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};


// Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await PostDetail.findByIdAndDelete(post.postDetail);
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
