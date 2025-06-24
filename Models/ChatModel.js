import mongoose from "mongoose";
import User from "./UserModel.js";
import Message from "./MessageModel.js";

const ChatModel = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMsg: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    isAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatModel);

export default Chat;
