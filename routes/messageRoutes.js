const express = require("express");
const {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} = require("../Controllers/messageController.js");

const protectRoute = require("../middleware/protectRoute.js");

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
