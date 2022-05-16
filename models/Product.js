const mongoose = require("mongoose");

const CartItem = require("./CartItem");

const productSchema = new mongoose.Schema({
  collectionName: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "CollectionName",
    required: true,
  },
  productType: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "ProductType",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Man", "Woman", "Unisex"],
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  xs: {
    type: String,
    required: true,
    min: 0,
  },
  s: {
    type: String,
    required: true,
    min: 0,
  },
  m: {
    type: String,
    required: true,
    min: 0,
  },
  l: {
    type: String,
    required: true,
    min: 0,
  },
  xl: {
    type: String,
    required: true,
    min: 0,
  },
  xxl: {
    type: String,
    required: true,
    min: 0,
  },
  xxxl: {
    type: String,
    required: true,
    min: 0,
  },
  xxxxl: {
    type: String,
    required: true,
    min: 0,
  },
});

productSchema.pre("remove", function (next) {
  CartItem.remove({ product: this._id }).exec;
  next();
});

module.exports = mongoose.model("Product", productSchema);
