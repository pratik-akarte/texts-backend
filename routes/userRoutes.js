const express = require("express");
const {
  registerUser,
  authUser,
  logOutUser,
  updateProfile,
  CheckUser,
} = require("../Controllers/userController.js");

const protectRoute = require("../middleware/protectRoute.js");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authUser);
router.post("/logout", logOutUser);

router.put("/updateProfilePic", protectRoute, updateProfile);

router.get("/check", protectRoute, CheckUser);

module.exports = router;
