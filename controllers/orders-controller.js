const HttpError = require("../models/http-error");
const Order = require("../models/Order");

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
  const cartId = req.params.id;

  let orders;

  try {
    orders = await Order.find({ cart: cartId });
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

const createOrder = async (req, res, next) => {};

const updateOrder = async (req, res, next) => {};

exports.getOrders = getOrders;
exports.getOrdersFromUser = getOrdersFromUser;
exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
