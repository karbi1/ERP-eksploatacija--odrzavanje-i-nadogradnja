const req = require("express/lib/request");
const jwt = require("jsonwebtoken");

const ROLE = require("../data/data");
const HttpError = require("../models/http-error");

function authRole(role, admin) {
  return (req, res, next) => {
    if (req.userData.role === role || req.userData.role === admin) {
      next();
    } else {
      throw new Error("Not allowed!");
    }
  };
}

const authUser = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, "private_key");
    req.userData = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};

module.exports = {
  authUser,
  authRole,
};
