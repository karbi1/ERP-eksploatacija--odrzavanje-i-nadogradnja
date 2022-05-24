const HttpError = require("../models/http-error");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const ROLE = require("../data/data");
const { default: mongoose } = require("mongoose");

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

  /*   TOTALNI DEBIL
  if (buyerId !== req.userData.userId) {
    const Error = new HttpError("You are not allowed to access this cart", 401);
    return next(Error);
  }*/

  const { productId, amount, size } = req.body;

  let enoughQuantity;

  try {
    enoughQuantity = await checkQuantity(productId, amount, size);
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!enoughQuantity) {
    const Error = new HttpError("There is not enough product");
    return next(Error);
  }

  const cartItemId = new mongoose.Types.ObjectId().toHexString();

  const cartItem = new CartItem({
    _id: cartItemId,
    product: productId,
    amount: amount,
    size: size,
  });

  let cart;
  try {
    cart = await Cart.findOne({ buyer: buyerId });
  } catch (err) {
    const error = new HttpError("Fetching cart failed", 500);
    return next(error);
  }
  cartItem.cartId = cart.buyer._id;
  cart.cartItems.push(cartItem);

  try {
    const sess = await mongoose.startSession();
    await cartItem.save({ session: sess });
    await cart.save({ session: sess });
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Adding to cart failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({ cart: cart });
};

const removeCartItem = async (req, res, next) => {
  const cartItemId = req.params.id;
  const userId = req.userData.userId;

  let cartItem;
  try {
    cartItem = await CartItem.findById(cartItemId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  let cart;

  try {
    cart = await Cart.findOne({ buyer: userId });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  try {
    cart.cartItems.pull(cartItem.id);
    cart.save();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ message: "Removed item from cart." });
};

const emptyCart = async (req, res, next) => {
  const userId = req.userData.userId;

  let cart;

  try {
    cart = await Cart.findOne({ buyer: userId });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  try {
    cart.cartItems = [];
    cart.save();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ message: "Cart emptied." });
};

async function checkQuantity(productId, neededAmount, size) {
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }
  let currentAmount;
  switch (size) {
    case "XS":
      currentAmount = Number(product.xs);
      break;
    case "S":
      currentAmount = Number(product.s);
      break;
    case "M":
      currentAmount = Number(product.m);
      break;
    case "L":
      currentAmount = Number(product.l);
      break;
    case "XL":
      currentAmount = Number(product.xl);
      break;
    case "XXL":
      currentAmount = Number(product.xxl);
      break;
    case "XXXL":
      currentAmount = Number(product.xxxl);
      break;
    case "XXXXL":
      currentAmount = Number(product.xxxxl);
      break;
  }
  if (currentAmount < neededAmount) {
    return false;
  }
  return true;
}

exports.getCarts = getCarts;
exports.getCartForUser = getCartForUser;
exports.addCartItem = addCartItem;
exports.removeCartItem = removeCartItem;
exports.emptyCart = emptyCart;
