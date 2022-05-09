const mongoose = require("mongoose");

const collectionNameSchema = new mongoose.Schema({
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Seller",
  },
  name: String,
  description: String,
  created: Date,
});

module.exports = mongoose.model("CollectionName", collectionNameSchema);
