//chatname
//groupchat
//latest message
//list of users
//admin of groups

const mongoose = require("mongoose");

const ChatModel = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: { type: mongoose.Schema.Types.ObjectId, ref: User },
    latestMsg: { type: mongoose.Schema.Types.ObjectId, ref: Message },
    isAdmin: { type: mongoose.Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
);

//Creates a Mongoose model named 'Chats' based on the ChatModel

module.exports = ("Chat", ChatModel);
