import asyncHandler from "express-async-handler";
import User from "../Models/UserModel.js";
import generateToken from "../config/generateToken.js";
import cloudinary from "../config/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  console.log(req.body);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all required fields.");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const userExists = await User.findOne({ normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error("User already exist, Please login");
  }

  const newUser = await User.create({
    name,
    email: normalizedEmail,
    password,
    pic,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      token: generateToken(newUser._id, res),
    });

    await newUser.save();
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id, res),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logging out: " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const CheckUser = asyncHandler(async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in authenticating user: " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { pic } = req.body;
    const userId = req.user._id;

    if (!pic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(pic, {
      folder: "profile_pictures",
      resource_type: "auto",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updating profile picture:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

export {
  registerUser,
  authUser,
  logOutUser,
  updateProfile,
  CheckUser
};
