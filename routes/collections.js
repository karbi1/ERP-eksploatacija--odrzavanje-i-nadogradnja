const express = require("express");

const collectionsController = require("../controllers/collections-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", collectionsController.getCollections);

router.use(checkAuth);

router.get("/:id", collectionsController.getCollectionById);

router.post("/", collectionsController.createCollection);

router.patch("/:id", collectionsController.updateCollection);

router.delete("/:id", collectionsController.deleteCollection);

module.exports = router;
