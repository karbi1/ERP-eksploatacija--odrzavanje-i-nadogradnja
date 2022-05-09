const express = require("express");

const productTypesController = require("../controllers/productTypes-controller");

const router = express.Router();

router.get("/", productTypesController.getProductTypes);

router.post("/", productTypesController.createProductType);

router.patch("/:id", productTypesController.updateProductType);

router.delete("/:id", productTypesController.deleteProductType);

module.exports = router;
