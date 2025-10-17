import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";
import path from "path";

dotenv.config();

// middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Correct CORS Setup
app.use(
  cors({
    origin: [
      "https://chatapp-yt-vu7b.onrender.com", // 👈 frontend render url
      "http://localhost:5173", // (optional, local testing)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 👈 यह बहुत जरूरी है
  })
);

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

// ✅ MongoDB Connection
try {
  await mongoose.connect(URI);
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.log("❌ MongoDB Connection Error:", error.message);
}

// ✅ Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// ✅ Production Build Serve
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static("./Frontend/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./Frontend/dist", "index.html"));
  });
}

// ✅ Server Listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
