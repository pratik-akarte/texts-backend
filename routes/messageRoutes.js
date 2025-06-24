import express from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../Controllers/messageController.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
