const express = require("express");

const productsController = require("../controllers/products-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/", productsController.getProducts);

router.get("/:id", productsController.getProductById);

router.post(
  "/",
  authUser,
  authRole(ROLE.SELLER),
  productsController.createProduct
);

router.patch(
  "/:id",
  authUser,
  authRole(ROLE.SELLER),
  productsController.updateProduct
);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.SELLER),
  productsController.deleteProduct
);

module.exports = router;
