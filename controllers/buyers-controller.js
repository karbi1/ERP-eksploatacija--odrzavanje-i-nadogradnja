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

const updateBuyer = async (req, res, next) => {
  const { email, password, name, lastName, dateOfBirth } = req.body;
  const buyerId = req.params.id;

  let buyer;
  try {
    buyer = await Buyer.findById(buyerId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }
  if (buyer._id.toString() !== req.userData.userId) {
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

  buyer.dateOfBirth = dateOfBirth;
  buyer.name = name;
  buyer.lastName = lastName;
  buyer.email = email;
  buyer.password = hashedPassword;

  try {
    await buyer.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update.", 500);
    return next(error);
  }

  res.status(200).json({ buyer: buyer.toObject({ getters: true }) });
};

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
    role: "Buyer",
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
      {
        userId: createdBuyer.id,
        email: createdBuyer.email,
        role: createdBuyer.role,
      },
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

  res.status(201).json({
    userId: createdBuyer.id,
    email: createdBuyer.email,
    token: token,
    role: createdBuyer.role,
  });
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
      {
        userId: existingBuyer.id,
        email: existingBuyer.email,
        role: existingBuyer.role,
      },
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
    role: existingBuyer.role,
    token: token,
  });
};

const removeBuyer = async (req, res, next) => {
  const buyerId = req.params.id;

  let buyer;
  try {
    buyer = await Buyer.findById(buyerId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (buyerId !== req.userData.userId || req.userData.role !== ROLE.ADMIN) {
    const Error = new HttpError(
      "You are not allowed to delete this buyer",
      401
    );
    return next(Error);
  }

  try {
    Buyer.remove();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

exports.getBuyers = getBuyers;
exports.updateBuyer = updateBuyer;
exports.signup = signup;
exports.login = login;
exports.removeBuyer = removeBuyer;
