/*const express = require("express");

const cartItemsController = require("../controllers/cartItems-controller.js");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/");

router.post(
  "/",
  authUser,
  authRole(ROLE.BUYER),
  cartItemsController.createCartItem
);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.BUYER),
  cartItemsController.deleteCartItem
);

module.exports = router;
*/
