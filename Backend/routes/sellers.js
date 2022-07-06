const express = require("express");

const sellersController = require("../controllers/sellers-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/", sellersController.getSellers);

router.get("/:id/collections", sellersController.getSellerCollections);

router.get("/:id", sellersController.getSellerById);

router.post("/signup", sellersController.signup);

router.patch(
  "/:id",
  authUser,
  authRole(ROLE.SELLER),
  sellersController.updateSeller
);

router.post("/login", sellersController.login);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.ADMIN, true),
  sellersController.deleteSeller
);

module.exports = router;
