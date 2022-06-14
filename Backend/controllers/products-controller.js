const HttpError = require("../models/http-error");
const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find().populate("productType");
  } catch (err) {
    const error = new HttpError("Fetching products failed", 500);
    return next(error);
  }
  res.json({ products: products });
};

const getProductById = async (req, res, next) => {
  const productId = req.params.id;

  let product;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const createProduct = async (req, res, next) => {
  const {
    seller,
    collectionName,
    productType,
    name,
    description,
    gender,
    price,
    s,
    m,
    l,
    xl,
  } = req.body;

  const createdProduct = new Product({
    collectionName,
    seller,
    productType,
    name,
    description,
    gender,
    price,
    s,
    m,
    l,
    xl,
  });

  try {
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const {
    seller,
    collectionName,
    productType,
    name,
    description,
    gender,
    price,
    s,
    m,
    l,
    xl,
  } = req.body;
  const productId = req.params.id;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  if (seller !== req.userData.userId) {
    const Error = new HttpError(
      "You are not allowed to delete this collection",
      401
    );
    return next(Error);
  }
  product.seller = seller;
  product.collectionName = collectionName;
  product.productType = productType;
  product.name = name;
  product.description = description;
  product.gender = gender;
  product.price = price;
  product.s = s;
  product.m = m;
  product.l = l;
  product.xl = xl;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (product.seller.toString() !== req.userData.userId) {
    const Error = new HttpError(
      "You are not allowed to delete this collection",
      401
    );
    console.log(product.seller);
    console.log(req.userData.userId);
    return next(Error);
  }

  try {
    product.remove();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted product" });
};

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
