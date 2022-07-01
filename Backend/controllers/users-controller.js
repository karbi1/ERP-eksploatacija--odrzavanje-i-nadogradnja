const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ROLE = require("../data/data");
const HttpError = require("../models/http-error");
const Seller = require("../models/Seller");
const Buyer = require("../models/Buyer");
const AdminUser = require("../models/Admin");
const sellersController = require("../controllers/sellers-controller");
const buyersController = require("../controllers/buyers-controller");
const adminsController = require("../");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  let isValidPassword = false;
  let token;

  if (await Buyer.exists({ email: email })) {
    try {
      existingUser = await Buyer.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
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
  } else if (await Seller.exists({ email: email })) {
    try {
      existingUser = await Seller.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
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
  } else if (await AdminUser.exists({ email: email })) {
    try {
      existingUser = await AdminUser.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
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
  } else {
    const error = new HttpError("No user with that email.", 500);
    return next(error);
  }

  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in user failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    token: token,
  });
};

exports.login = login;
