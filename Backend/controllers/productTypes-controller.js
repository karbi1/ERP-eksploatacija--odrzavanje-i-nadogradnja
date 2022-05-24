const HttpError = require("../models/http-error");
const ProductType = require("../models/ProductType");

const getProductTypes = async (req, res, next) => {
  let productTypes;
  try {
    productTypes = await ProductType.find();
  } catch (err) {
    const error = new HttpError("Fetching product types failed", 500);
    return next(error);
  }
  res.json({ productTypes: productTypes });
};

const createProductType = async (req, res, next) => {
  const { type } = req.body;

  const createdProductType = new ProductType({
    type,
  });

  try {
    await createdProductType.save();
  } catch (err) {
    const error = new HttpError(
      "Creating product type failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ productType: createdProductType });
};

const updateProductType = async (req, res, next) => {
  const { type } = req.body;
  const productTypeId = req.params.id;

  let productType;
  try {
    productType = await ProductType.findById(productTypeId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  productType.type = type;

  try {
    await productType.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  res
    .status(200)
    .json({ productType: productType.toObject({ getters: true }) });
};

const deleteProductType = async (req, res, next) => {
  const productTypeId = req.params.id;

  let productType;
  try {
    productType = await ProductType.findById(productTypeId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  try {
    productType.remove();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted product type" });
};

exports.getProductTypes = getProductTypes;
exports.createProductType = createProductType;
exports.updateProductType = updateProductType;
exports.deleteProductType = deleteProductType;
