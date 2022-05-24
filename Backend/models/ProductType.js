const mongoose = require("mongoose");

const Product = require("./Product");

const productTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
});

productTypeSchema.pre("remove", function (next) {
  Product.updateMany(
    { productType: this._id },
    { $set: { productType: undefined } }
  ).exec();
  next();
});

module.exports = mongoose.model("ProductType", productTypeSchema);
