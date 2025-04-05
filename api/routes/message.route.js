import express from "express";
import {

} from "../controllers/message.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

// router.get("/", getUsers);                
// // router.get("/:id", getUser);                                                                              
// router.put("/:id", verifyToken, updateUser);
// router.delete("/:id", verifyToken, deleteUser);
// router.post("/save", verifyToken, savePost);
// router.get("/saved",verifyToken,savedPosts);
// router.get("/profilePosts", verifyToken, profilePosts);
// router.get("/notification", verifyToken, getNotificationNumber);

export default router;