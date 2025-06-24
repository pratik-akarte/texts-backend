import cloudinaryPackage from "cloudinary";
import dotenv from "dotenv";

// ✅ no destructuring here
dotenv.config();

const cloudinary = cloudinaryPackage.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET_KEY,
});

export default cloudinary;