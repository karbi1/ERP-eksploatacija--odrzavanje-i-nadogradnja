const HttpError = require("../models/http-error");
const Seller = require("../models/Seller");
const CollectionName = require("../models/CollectionName.js");

const getSellers = async (req, res, next) => {
  let sellers;
  try {
    sellers = await Seller.find();
  } catch (err) {
    const error = new HttpError("Fetching sellers failed.", 500);
    return next(error);
  }
  res.json({ sellers: sellers });
};

const getSellerCollections = async (req, res, next) => {
  const sellerId = req.params.id;

  let collections;
  try {
    collections = await CollectionName.find({ seller: sellerId });
  } catch (err) {
    const error = new HttpError("Fetching seller collections failed.", 500);
  }

  if (!collections) {
    const error = new HttpError(
      ("Could not find collections for the provided seller id.", 404)
    );
    return next(error);
  }

  res.json({ collections: collections });
};

const getSellerById = async (req, res, next) => {
  const sellerId = req.params.id;

  let seller;

  try {
    seller = await Seller.findById(sellerId);
  } catch (err) {
    const error = new HttpError("Fetching seller failed.", 500);
  }

  if (!seller) {
    const error = new HttpError(
      ("Could not find a seller for the provided id.", 404)
    );
    return next(error);
  }

  res.json({ seller: seller.toObject({ getters: true }) });
};

const updateSeller = async (req, res, next) => {};

const signup = async (req, res, next) => {
  const { email, password, brandName, brandDescription } = req.body;

  const hasSeller = Seller.find((s) => s.email === email);
  if (hasSeller) {
    throw new HttpError(
      "Seller is already registered with this email address.",
      401
    );
  }

  const createdSeller = new Seller({
    email,
    password,
    brandName,
    brandDescription,
  });

  try {
    await createdSeller.save();
  } catch (err) {
    const error = new HttpError(
      "Creating seller failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ seller: createdSeller });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedSeller = Seller.find((s) => s.email === email);
  if (!identifiedSeller || identifiedSeller.password !== password) {
    throw new HttpError("Wrong credentials.", 401);
  }

  res.json({ message: "Logged in." });
};

exports.getSellers = getSellers;
exports.signup = signup;
exports.login = login;
exports.getSellerById = getSellerById;
exports.getSellerCollections = getSellerCollections;
exports.updateSeller = updateSeller;
