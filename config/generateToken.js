import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "none", // REQUIRED for cross-domain in production
    secure: true, // REQUIRED with sameSite: none
    domain: ".vercel.app", // Leading dot for subdomains
    path: "/",
  });

  return token;
};

export default generateToken;
