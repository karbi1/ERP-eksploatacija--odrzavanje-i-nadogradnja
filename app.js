const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const collectionsRoutes = require("./routes/collections");
const buyersRoutes = require("./routes/buyers");
const sellersRoutes = require("./routes/sellers");
const productsRoutes = require("./routes/products");
const productTypesRoutes = require("./routes/productType");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/collections", collectionsRoutes); // => /collections/..
app.use("/buyers", buyersRoutes);
app.use("/sellers", sellersRoutes);
app.use("/products", productsRoutes);
app.use("/productTypes", productTypesRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown error occurred!" });
});

mongoose
  .connect("mongodb://localhost/webshopdb")
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
