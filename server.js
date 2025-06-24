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
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:2703",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/hola", (req, res) => {
  res.send("API running");
});

// API routes
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// No need for export in CommonJS
