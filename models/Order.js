const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  status: String,
  phoneNumber: Number,
  streetName: String,
  number: Number,
  floor: Number,
  postalCode: Number,
  region: String,
  country: String,
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Cart",
  },
});

module.exports = mongoose.model("Order", orderSchema);
