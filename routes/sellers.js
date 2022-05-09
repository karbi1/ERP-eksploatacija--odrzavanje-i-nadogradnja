const express = require("express");

const sellersController = require("../controllers/sellers-controller");

const router = express.Router();

router.get("/", sellersController.getSellers);

router.get("/:id/collections", sellersController.getSellerCollections);

router.get("/:id", sellersController.getSellerById);

router.post("/signup", sellersController.signup);

router.patch("/:id", sellersController.updateSeller);

router.post("/login", sellersController.login);

module.exports = router;
