import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import repliesRoutes from "./routes/replies.js";

const app = express();

// ==============================
//  MIDDLEWARES
// ==============================

// Parse JSON requests
app.use(express.json());

//  CORS (restrict in production)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ==============================
//  DATABASE CONNECTION
// ==============================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch(() => {
    console.log("❌ MongoDB connection failed");
    process.exit(1); // stop app if DB fails
  });

// ==============================
//  ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/replies", repliesRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send(" AutoMail AI Backend is running");
});

// ==============================
//  GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
  });
});

// ==============================
//  START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});