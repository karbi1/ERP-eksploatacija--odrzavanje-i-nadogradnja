const express = require("express");

const buyersController = require("../controllers/buyers-controller");

const router = express.Router();

router.get("/", buyersController.getBuyers);

router.patch("/:id", buyersController.updateBuyer);

router.post("/signup", buyersController.signup);

router.post("/login", buyersController.login);

module.exports = router;
