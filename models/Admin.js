const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  lastName: String,
  role: String,
});

module.exports = mongoose.model("Admin", adminSchema);
