const express = require("express");

const adminsController = require("../controllers/admins-controller");

const router = express.Router();

router.post("/login", adminsController.login);

module.exports = router;
