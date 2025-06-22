const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // ✅ no destructuring here

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET_KEY,
});

module.exports = cloudinary;
