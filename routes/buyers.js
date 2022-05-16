const express = require("express");

const buyersController = require("../controllers/buyers-controller");
const cartsController = require("../controllers/carts-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/", authUser, authRole(ROLE.ADMIN), buyersController.getBuyers);

router.get(
  "/:id/cart",
  authUser,
  authRole(ROLE.BUYER),
  cartsController.getCartForUser
);

router.patch(
  "/:id",
  authUser,
  authRole(ROLE.BUYER),
  buyersController.updateBuyer
);

router.post("/signup", buyersController.signup);

router.post("/login", buyersController.login);

router.delete(
  "/",
  authUser,
  authRole(ROLE.BUYER, true),
  buyersController.removeBuyer
);

module.exports = router;
