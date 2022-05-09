const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Buyer",
  },
  cartItems: [
    {
      type: mongoose.SchemaType.ObjectId,
      ref: "CartItem",
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
