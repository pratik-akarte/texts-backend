const asyncHandler = require("express-async-handler");

const User = require("../Models/UserModel.js");
const Message = require("../Models/MessageModel.js");
const { default: cloudinary } = require("../config/cloudinary.js");
const { getReceiverSocketId, io } = require("./../config/socket.js");

const getUsersForSidebar = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // this line finds all users in database whose _id is not equalto ($ne) to logged in user id  as we want to see only our contacts messages
    // also -password means not including password field in response

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsers ForSidebar:" + error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    //user to chat with
    const { id: userToChatId } = req.params;

    //our USERid
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    //it fetches all the function where i am sender and next person is receiver and vice versa

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:" + error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    // Check if file was uploaded (for form-data)
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
    }
    // Check if image URL was sent directly (for JSON)
    else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    ///realtime socket implementation
    const SocketReceiverID = getReceiverSocketId(receiverId);

    if (SocketReceiverID) {
      io.to(SocketReceiverID).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error in sending message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { getUsersForSidebar, getMessages, sendMessage };
