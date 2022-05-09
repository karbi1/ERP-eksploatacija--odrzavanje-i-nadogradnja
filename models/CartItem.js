const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  cartId: mongoose.SchemaTypes.ObjectId,
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
  },
  amount: Number,
  size: String,
});

module.exports = mongoose.model("CartItem", cartItemSchema);
