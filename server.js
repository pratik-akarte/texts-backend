const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { errorHandler, notFound } = require("./Controllers/errorHandlers.js");
const { app, server, io } = require("./config/socket.js");

// Load env variables
dotenv.config();

// DB connection
connectDB();

// Setup middlewares
app.use(express.json()); // To parse JSON
app.use(cookieParser());
app.use(helmet()); // Secure HTTP headers
app.use(
  cors({
    origin: "http://localhost:2703",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logging in dev mode
}

// Routes
app.get("/", (req, res) => {
  res.send("API running");
});

app.get(["/login"], (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// so what you're actually doing is:
// Passing a function to .find()
// That function returns true for the matching object
// .find() then returns the first object where that function returns true

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`.yellow.bold);
});
