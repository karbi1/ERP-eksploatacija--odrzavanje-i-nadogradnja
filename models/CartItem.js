const mongoose = require("mongoose");

const Cart = require("./Cart");

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

cartItemSchema.pre("remove", function (next) {
  //console.log(Cart.cartItems)
});

module.exports = mongoose.model("CartItem", cartItemSchema);
