import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  email: { type: String },      
  username: { type: String },   
  tone: { type: String, required: true },
  userMessage: { type: String, required: true },
  subject: { type: String },
  body: { type: String },

}, { timestamps: true });

export default mongoose.model("Reply", replySchema);