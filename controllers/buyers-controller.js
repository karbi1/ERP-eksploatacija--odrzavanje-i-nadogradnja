const HttpError = require("../models/http-error");
const Buyer = require("../models/Buyer");

const DUMMY_BUYERS = [{ id: "1", name: "Nikola", password: "sifrarijus" }];

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

  const hasBuyer = Buyer.find((b) => b.email === email);
  if (hasBuyer) {
    throw new HttpError(
      "Buyer is already registered with this email address",
      401
    );
  }

  const createdBuyer = new Buyer({
    email,
    password,
    name,
    lastName,
    dateOfBirth,
  });

  try {
    await createdBuyer.save();
  } catch (err) {
    const error = new HttpError(
      "Creating buyer failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ buyer: createdBuyer });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedBuyer = Buyer.find((b) => b.email === email);
  if (!identifiedBuyer || identifiedBuyer.password !== password) {
    throw new HttpError("Wrong credentials.", 401);
  }

  res.json({ message: "Logged in." });
};

exports.getBuyers = getBuyers;
exports.updateBuyer = updateBuyer;
exports.signup = signup;
exports.login = login;
