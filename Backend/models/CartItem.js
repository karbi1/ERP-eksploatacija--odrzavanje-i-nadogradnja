const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Cart",
    required: true,
  },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: true,
  },
  amount: {
    type: Number,
    min: 1,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CartItem", cartItemSchema);
