const express = require("express");

const ordersController = require("../controllers/orders-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/", ordersController.getOrders);

router.get(
  "/:id",
  authUser,
  authRole(ROLE.BUYER),
  ordersController.getOrdersFromUser
);

router.post("/", authUser, authRole(ROLE.BUYER), ordersController.createOrder);

module.exports = router;
