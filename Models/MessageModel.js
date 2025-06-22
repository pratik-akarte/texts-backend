const mongoose = require("mongoose");

const MessageModel = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, trim: true },
    image: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageModel);
