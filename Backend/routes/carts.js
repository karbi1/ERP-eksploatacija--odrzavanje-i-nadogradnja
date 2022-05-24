const express = require("express");

const cartsController = require("../controllers/carts-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

//router.get("/", authUser, authRole(ROLE.ADMIN), cartsController.getCarts);
router.get("/", cartsController.getCarts);

router.get(
  "/:id",
  authUser,
  authRole(ROLE.BUYER, true),
  cartsController.getCartForUser
);

router.post("/", authUser, authRole(ROLE.BUYER), cartsController.addCartItem);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.BUYER),
  cartsController.removeCartItem
);

router.delete("/", authUser, authRole(ROLE.BUYER), cartsController.emptyCart);

module.exports = router;
