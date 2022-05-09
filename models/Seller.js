const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  email: String,
  password: String,
  brandName: String,
  brandDescription: String,
});

module.exports = mongoose.model("Seller", sellerSchema);
