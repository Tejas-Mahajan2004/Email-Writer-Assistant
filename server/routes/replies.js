import fetch from "node-fetch";
import express from "express";
import auth from "../middleware/auth.js";
import Reply from "../models/Reply.js";

const router = express.Router();

// ==============================
//  GENERATE EMAIL REPLY
// ==============================
router.post("/generate-reply", auth, async (req, res) => {
  try {
    let { userMessage, tone } = req.body;

    //  Validate input
    if (!userMessage || !tone) {
      return res.status(400).json({
        message: "Message and tone are required",
      });
    }

    userMessage = userMessage.trim();

    //  Call Groq API
    const apiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an AI email assistant. Generate clean, professional email replies.",
          },
          {
            role: "user",
            content: `Write a ${tone} reply to this email:\n\n"${userMessage}"\n\nReturn format strictly:\nSubject: <subject>\nBody: <email body>`,
          },
        ],
      }),
    });

    const data = await apiRes.json();

    //  API failure check
    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({
        message: "AI did not return valid response",
      });
    }

    const emailText = data.choices[0].message.content;

    //  Safe parsing
    let subject = "Generated Subject";
    let body = emailText;

    const subjectMatch = emailText.match(/Subject:\s*(.*)/i);
    if (subjectMatch) subject = subjectMatch[1].trim();

    const bodyParts = emailText.split(/Body:\s*/i);
    if (bodyParts.length > 1) body = bodyParts[1].trim();

    //  Save to DB
    await Reply.create({
      user: req.user.id,
      email: req.user.email,
      username: req.user.name,
      tone,
      userMessage,
      subject,
      body,
    });

    //  Send response
    res.json({ subject, body });

  } catch (err) {
    res.status(500).json({
      message: "Error generating email reply",
    });
  }
});

// ==============================
// GET USER REPLIES
// ==============================
router.get("/", auth, async (req, res) => {
  try {
    const replies = await Reply.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(replies);
  } catch {
    res.status(500).json({
      message: "Failed to fetch replies",
    });
  }
});

export default router;