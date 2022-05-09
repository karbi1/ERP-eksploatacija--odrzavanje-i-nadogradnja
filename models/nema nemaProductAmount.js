const mongoose = require("mongoose");

const productAmountSchema = new mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
  },
  xs: Number,
  s: Number,
  m: Number,
  l: Number,
  xl: Number,
  xxl: Number,
  xxxl: Number,
  xxxxl: Number,
});

module.exports = mongoose.model("ProductAmount", productAmountSchema);
