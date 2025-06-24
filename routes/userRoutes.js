import express from "express";
import {
  registerUser,
  authUser,
  logOutUser,
  updateProfile,
  CheckUser,
} from "../Controllers/userController.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authUser);
router.post("/logout", logOutUser);
router.put("/updateProfilePic", protectRoute, updateProfile);
router.get("/check", protectRoute, CheckUser);

export default router;
