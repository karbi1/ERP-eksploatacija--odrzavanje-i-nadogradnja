const express = require("express");
const { check } = require("express-validator");

const collectionsController = require("../controllers/collections-controller");

const router = express.Router();

router.get("/", collectionsController.getCollections);

router.get("/:id", collectionsController.getCollectionById);

router.post("/", collectionsController.createCollection);

router.patch("/:id", collectionsController.updateCollection);

router.delete("/:id", collectionsController.deleteCollection);

module.exports = router;
