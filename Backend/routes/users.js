const express = require("express");

const usersController = require("../controllers/users-controller");
const { authUser, authRole } = require("../middleware/auth");
const { ROLE } = require("../data/data");

const router = express.Router();

router.post("/login", usersController.login);

module.exports = router;
