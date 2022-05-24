const express = require("express");

const productTypesController = require("../controllers/productTypes-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/", productTypesController.getProductTypes);

/*router.post(
  "/",
  authUser,
  authRole(ROLE.ADMIN),
  productTypesController.createProductType
);*/

router.post("/", productTypesController.createProductType);

router.patch(
  "/:id",
  authUser,
  authRole(ROLE.ADMIN),
  productTypesController.updateProductType
);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.ADMIN),
  productTypesController.deleteProductType
);

module.exports = router;
