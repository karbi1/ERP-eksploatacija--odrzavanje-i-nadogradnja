const HttpError = require("../models/http-error");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const ROLE = require("../data/data");

const getCarts = async (req, res, next) => {
  let carts;
  try {
    carts = await Cart.find().populate("buyer");
  } catch (err) {
    const error = new HttpError("Fetching carts failed", 500);
    return next(error);
  }
  res.json({ carts: carts });
};

const getCartForUser = async (req, res, next) => {
  const buyerId = req.params.id;

  if (buyerId !== req.userData.userId && req.userData.role !== ROLE.ADMIN) {
    const Error = new HttpError("You are not allowed to access this cart", 401);
    return next(Error);
  }

  let cart;

  try {
    cart = await Cart.find({ buyer: buyerId });
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  res.json({ cart: cart });
};

const addCartItem = async (req, res, next) => {
  const buyerId = req.userData.userId;

  if (buyerId !== req.userData.userId) {
    const Error = new HttpError("You are not allowed to access this cart", 401);
    return next(Error);
  }

  const { productId, amount, size } = req.body;

  const cartItem = new CartItem({});
};

const removeCartItem = async (req, res, next) => {};

exports.getCarts = getCarts;
exports.getCartForUser = getCartForUser;
exports.addCartItem = addCartItem;
exports.removeCartItem = removeCartItem;
