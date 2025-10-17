import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { app, server } from "./SocketIO/server.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import express from 'express';

dotenv.config();

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Setup
app.use(
  cors({
    origin: "https://chatapp-yt-vu7b.onrender.com", // ✅ Render frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ---------- Database ----------
const URI = process.env.MONGODB_URI;
try {
  await mongoose.connect(URI);
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.log("❌ MongoDB Connection Error:", error.message);
}

// ---------- Routes ----------
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// ---------- Production Build ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/dist", "index.html"));
  });
}

// ---------- Server Start ----------
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
