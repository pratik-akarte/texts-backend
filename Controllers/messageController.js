import asyncHandler from "express-async-handler";

import User from "../Models/UserModel.js";
import Message from "../Models/MessageModel.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";

const getUsersForSidebar = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: " + error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages: " + error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (req.file) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: "chat_images",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({ error: "Image upload failed" });
      }
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const socketReceiverId = getReceiverSocketId(receiverId);

    if (socketReceiverId) {
      io.to(socketReceiverId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error in sending message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { getUsersForSidebar, getMessages, sendMessage };
