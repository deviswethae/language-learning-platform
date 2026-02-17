const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: String,
  email: { type: String, unique: true, required: true },
  password: String, // still allow regular login
});

module.exports = mongoose.model("User", userSchema);
