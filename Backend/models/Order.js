const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  totalPrice: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  region: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "CartItem",
    },
  ],
  buyer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Buyer",
  },
});

module.exports = mongoose.model("Order", orderSchema);
