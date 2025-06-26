import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  if (!token) console.log("jwt failed to generate token");
  if (process.env.JWT_SECRET_KEY)
    console.log("secret key:" + process.env.JWT_SECRET_KEY);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "None", // Required for cross-origin
    secure: true, // Required for SameSite=None (HTTPS)
  });

  return token;
};

export default generateToken;
