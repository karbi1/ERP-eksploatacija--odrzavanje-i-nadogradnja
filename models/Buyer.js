const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  lastName: String,
  dateOfBirth: Date,
});

module.exports = mongoose.model("Buyer", buyerSchema);
