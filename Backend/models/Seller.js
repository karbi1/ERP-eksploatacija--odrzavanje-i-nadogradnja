const mongoose = require("mongoose");

const CollectionName = require("./CollectionName");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const sellerSchema = new mongoose.Schema({
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
  brandName: {
    type: String,
    required: true,
  },
  brandDescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  role: String,
});

sellerSchema.pre("remove", function (next) {
  CollectionName.remove({ seller: this._id }).exec();
  next();
});

module.exports = mongoose.model("Seller", sellerSchema);
