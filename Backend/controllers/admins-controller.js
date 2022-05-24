const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Admin = require("../models/Admin");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingAdmin;

  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingAdmin) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
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
        userId: existingAdmin.id,
        email: existingAdmin.email,
        role: existingAdmin.role,
      },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in admin failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingAdmin.id,
    email: existingAdmin.email,
    role: existingAdmin.role,
    token: token,
  });
};

exports.login = login;
