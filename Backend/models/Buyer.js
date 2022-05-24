const mongoose = require("mongoose");

const Cart = require("../models/Cart");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const buyerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 10,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  role: String,
});

buyerSchema.pre("remove", function (next) {
  Cart.remove({ buyer: this._id }).exec();
  next();
});

module.exports = mongoose.model("Buyer", buyerSchema);
