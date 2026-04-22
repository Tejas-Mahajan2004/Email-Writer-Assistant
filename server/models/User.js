import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: "" },
});

userSchema.pre("save", async function (next) {
  if (!this.password) return next();

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);