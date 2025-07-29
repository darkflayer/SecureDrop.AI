const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Admin", AdminSchema);
