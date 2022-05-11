const express = require("express");

const ordersController = require("../controllers/orders-controller");

const router = express.Router();

router.get("/", ordersController.getOrders);

router.get("/:id", ordersController.getOrdersFromUser);

router.post("/", ordersController.createOrder);

router.patch("/:id", ordersController.updateOrder);

module.exports = router;
