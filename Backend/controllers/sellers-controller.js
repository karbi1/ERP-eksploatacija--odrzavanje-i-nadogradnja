const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ROLE = require("../data/data");
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
    return next(error);
  }

  if (!seller) {
    const error = new HttpError(
      ("Could not find a seller for the provided id.", 404)
    );
    return next(error);
  }

  res.json({ seller: seller.toObject({ getters: true }) });
};

const updateSeller = async (req, res, next) => {
  const { brandName, brandDescription, email, password } = req.body;
  const sellerId = req.params.id;

  let seller;
  try {
    seller = await Seller.findById(sellerId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }
  if (
    seller._id.toString() !== req.userData.userId ||
    req.userData.role !== ROLE.ADMIN
  ) {
    const error = new HttpError(
      "You are not allowed to edit this collection",
      401
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not update user, please try again.",
      500
    );
    return next(error);
  }

  seller.email = email;
  seller.password = hashedPassword;
  seller.brandName = brandName;
  seller.brandDescription = brandDescription;

  try {
    await seller.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  res.status(200).json({ seller: seller.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const { email, password, brandName, brandDescription } = req.body;

  let existingSeller;
  try {
    existingSeller = await Seller.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  if (existingSeller) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdSeller = new Seller({
    email,
    password: hashedPassword,
    brandName,
    brandDescription,
    role: "Seller",
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

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdSeller.id,
        email: createdSeller.email,
        role: createdSeller.role,
      },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Creating seller failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdSeller.id,
    email: createdSeller.email,
    role: createdSeller.role,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingSeller;

  try {
    existingSeller = await Seller.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingSeller) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingSeller.password);
  } catch (err) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingSeller.id,
        email: existingSeller.email,
        role: existingSeller.role,
      },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in seller failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingSeller.id,
    email: existingSeller.email,
    role: existingSeller.role,
    token: token,
  });
};

const deleteSeller = async (req, res, next) => {
  const sellerId = req.params.id;

  let seller;
  try {
    seller = await Seller.findById(sellerId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (sellerId !== req.userData.userId || req.userData.role !== ROLE.ADMIN) {
    const Error = new HttpError(
      "You are not allowed to delete this seller",
      401
    );
    return next(Error);
  }

  try {
    Seller.remove();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

exports.getSellers = getSellers;
exports.signup = signup;
exports.login = login;
exports.getSellerById = getSellerById;
exports.getSellerCollections = getSellerCollections;
exports.updateSeller = updateSeller;
exports.deleteSeller = deleteSeller;
