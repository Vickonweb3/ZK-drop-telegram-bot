const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  wallet: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
