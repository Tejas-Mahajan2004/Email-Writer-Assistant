import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//  Generate JWT token
const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

//  Standard response formatter
const sendAuthResponse = (res, user) => {
  const token = generateToken(user);
  return res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
    },
  });
};

// ==============================
//  SIGNUP
// ==============================
router.post("/signup", async (req, res) => {
  try {
    let { email, password, name } = req.body;

    // 🔒 sanitize input
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new User({
      email,
      password,
      name: name || email.split("@")[0],
    });

    await newUser.save();

    return sendAuthResponse(res, newUser);

  } catch (err) {
    res.status(500).json({
      message: "Signup failed",
    });
  }
});

// ==============================
//  LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please signup first.",
      });
    }

    //  Google users (no password)
    if (!user.password) {
      return sendAuthResponse(res, user);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    return sendAuthResponse(res, user);

  } catch (err) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ==============================
//  GOOGLE LOGIN
// ==============================
router.post("/google-login", async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        message: "Google token missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    //  ensure verified email
    if (!payload.email_verified) {
      return res.status(400).json({
        message: "Google email not verified",
      });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name;

    let user = await User.findOne({ email });

    //  auto signup
    if (!user) {
      user = new User({
        email,
        name,
        password: "",
      });

      await user.save();
    }

    return sendAuthResponse(res, user);

  } catch (err) {
    res.status(500).json({
      message: "Google login failed",
    });
  }
});

export default router;