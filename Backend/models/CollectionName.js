const mongoose = require("mongoose");

const Product = require("./Product");

const collectionNameSchema = new mongoose.Schema({
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Seller",
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
  created: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
});

collectionNameSchema.pre("remove", function (next) {
  Product.remove({ collectionName: this._id }).exec();
  next();
});

module.exports = mongoose.model("CollectionName", collectionNameSchema);
