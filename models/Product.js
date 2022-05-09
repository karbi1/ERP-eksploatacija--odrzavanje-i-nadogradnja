const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  collectionName: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "CollectionName",
  },
  productType: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "ProductType",
  },
  name: String,
  description: String,
  gender: String,
  price: Number,
  discount: Number,
  xs: Number,
  s: Number,
  m: Number,
  l: Number,
  xl: Number,
  xxl: Number,
  xxxl: Number,
  xxxxl: Number,
});

module.exports = mongoose.model("Product", productSchema);
