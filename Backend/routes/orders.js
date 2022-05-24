const express = require("express");

const ordersController = require("../controllers/orders-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/", ordersController.getOrders);

router.get(
  "/:id",
  authUser,
  authRole(ROLE.BUYER, true),
  ordersController.getOrdersFromUser
);

router.post("/", authUser, authRole(ROLE.BUYER), ordersController.createOrder);

router.post("/:id", authUser, authRole(ROLE.BUYER), ordersController.order);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.BUYER),
  ordersController.cancelOrder
);

module.exports = router;
