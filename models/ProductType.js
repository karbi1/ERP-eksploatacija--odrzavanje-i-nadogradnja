const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema({
  type: String,
});

module.exports = mongoose.model("ProductType", productTypeSchema);
