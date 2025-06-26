import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    console.log(token);

    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized login: No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

   

    if (!decoded) {
      return res
        .status(400)
        .json({ message: "Unauthorized login: Invalid token." });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Unauthorized login: User not found." });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Error in protectRoute middleware: " + err.message);
    res.status(500).json({ message: "Internal Protected Route Error" });
  }
};

export default protectRoute;
