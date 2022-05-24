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
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  xs: {
    type: Number,
    required: true,
    min: 0,
  },
  s: {
    type: Number,
    required: true,
    min: 0,
  },
  m: {
    type: Number,
    required: true,
    min: 0,
  },
  l: {
    type: Number,
    required: true,
    min: 0,
  },
  xl: {
    type: Number,
    required: true,
    min: 0,
  },
  xxl: {
    type: Number,
    required: true,
    min: 0,
  },
  xxxl: {
    type: Number,
    required: true,
    min: 0,
  },
  xxxxl: {
    type: Number,
    required: true,
    min: 0,
  },
});

productSchema.pre("remove", function (next) {
  CartItem.remove({ product: this._id }).exec;
  next();
});

module.exports = mongoose.model("Product", productSchema);
