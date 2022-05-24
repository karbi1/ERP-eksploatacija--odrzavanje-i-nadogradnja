const express = require("express");

const collectionsController = require("../controllers/collections-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.get("/", collectionsController.getCollections);

router.get("/:id", collectionsController.getCollectionById);

router.post(
  "/",
  authUser,
  authRole(ROLE.SELLER),
  collectionsController.createCollection
);

router.patch(
  "/:id",
  authUser,
  authRole(ROLE.SELLER, true),
  collectionsController.updateCollection
);

router.delete(
  "/:id",
  authUser,
  authRole(ROLE.SELLER, true),
  collectionsController.deleteCollection
);

module.exports = router;