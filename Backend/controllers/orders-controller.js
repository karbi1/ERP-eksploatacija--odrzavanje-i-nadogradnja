const HttpError = require("../models/http-error");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const CartItem = require("../models/CartItem");

const mongoose = require("mongoose");

const getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find();
  } catch (err) {
    const error = new HttpError("Fetching orders failed", 500);
    return next(error);
  }
  res.json({ orders: orders });
};

const getOrdersFromUser = async (req, res, next) => {
  const buyerId = req.userData.userId;

  let orders;

  try {
    orders = await Order.find({ buyer: buyerId });
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (!orders) {
    const error = new HttpError("This user has no orders", 404);
    return next(error);
  }

  res.json({ orders: orders });
};

const createOrder = async (req, res, next) => {
  const buyerId = req.userData.userId;
  let cart;
  let enoughQuantity;
  let totalPrice = 0;

  try {
    cart = await Cart.findOne({ buyer: buyerId }).populate("cartItems");
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  if (cart.cartItems.length === 0) {
    const error = new HttpError("Cart is empty, can't create order.", 500);
    return next(error);
  }

  const { phoneNumber, address, floor, postalCode, city, region, country } =
    req.body;

  for (const cartItem of cart.cartItems) {
    if (!checkProduct(cartItem)) {
      enoughQuantity = false;
      let product = await Product.findById(cartItem.product).select("name");
      const Error = new HttpError("There is not enough product: " + product);
      return next(Error);
    } else {
      enoughQuantity = true;
    }
    totalPrice += await calculatePrice(cartItem);
  }

  try {
    var order = await new Order({
      totalPrice: totalPrice,
      phoneNumber,
      address,
      floor,
      postalCode,
      city,
      region,
      country,
      buyer: buyerId,
      cartItems: cart.cartItems,
    });
    await order.save();
  } catch (err) {
    const error = new HttpError(
      "Creating order failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({ order: order });
};

async function calculatePrice(cartItem) {
  let product;
  try {
    product = await Product.findById(cartItem.product.toString());
  } catch (err) {
    return false;
  }
  return product.price * cartItem.amount;
}

async function checkProduct(cartItem) {
  let product;
  try {
    product = await Product.findById(cartItem.product.toString());
  } catch (err) {
    return false;
  }

  let size = cartItem.size;
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
    case "L":
      currentAmount = Number(product.l);
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

  if (currentAmount < cartItem.amount) {
    return false;
  }

  return true;
}

const order = async (req, res, next) => {
  const buyerId = req.userData.userId;
  const orderId = req.params.id;
  let order;
  let cart;

  try {
    order = await Order.findById(orderId);
    cart = await Cart.findOne({ buyer: buyerId });
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  try {
    cart.cartItems = [];
    cart.save();
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  res.json({ order: order });
};

const cancelOrder = async (req, res, next) => {
  const orderId = req.params.id;
  let order;
  try {
    order = await Order.deleteOne({ _id: orderId });
  } catch (err) {
    const error = new HttpError("Something went wrong.", 500);
    return next(error);
  }

  res.json({ removedOrder: order });
};

exports.getOrders = getOrders;
exports.getOrdersFromUser = getOrdersFromUser;
exports.createOrder = createOrder;
exports.cancelOrder = cancelOrder;
exports.order = order;
