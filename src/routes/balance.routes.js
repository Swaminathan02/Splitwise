const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller");
const authenticate = require("../middleware/auth.middleware");

router.get("/", authenticate, balanceController.getBalances);
module.exports = router;