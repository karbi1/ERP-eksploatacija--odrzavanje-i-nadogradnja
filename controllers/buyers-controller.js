const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Buyer = require("../models/Buyer");
const Cart = require("../models/Cart");

const getBuyers = async (req, res, next) => {
  let buyers;
  try {
    buyers = await Buyer.find();
  } catch (err) {
    const error = new HttpError("Fetching buyers failed.", 500);
    return next(error);
  }
  res.json({ buyers: buyers });
};

const updateBuyer = async (req, res, next) => {};

const signup = async (req, res, next) => {
  const { email, password, name, lastName, dateOfBirth } = req.body;

  let existingBuyer;
  try {
    existingBuyer = await Buyer.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  if (existingBuyer) {
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

  const createdBuyer = new Buyer({
    email,
    password: hashedPassword,
    name,
    lastName,
    dateOfBirth,
  });
  var createdCart = new Cart({});

  try {
    const sess = await mongoose.startSession();
    await createdBuyer.save({ session: sess });
    await createdCart.save({ session: sess });
    createdCart.buyer = createdBuyer;
    await createdCart.save({ session: sess });
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Creating buyer failed, please try again.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdBuyer.id, email: createdBuyer.email },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Creating buyer failed, please try again.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdBuyer.id, email: createdBuyer.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingBuyer;

  try {
    existingBuyer = await Buyer.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingBuyer) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingBuyer.password);
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
      { userId: existingBuyer.id, email: existingBuyer.email },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in buyer failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingBuyer.id,
    email: existingBuyer.email,
    token: token,
  });
};

exports.getBuyers = getBuyers;
exports.updateBuyer = updateBuyer;
exports.signup = signup;
exports.login = login;
