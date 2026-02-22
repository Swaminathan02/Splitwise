const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balance.controller");
const authenticate = require("../middleware/auth.middleware");

router.get("/", authenticate, balanceController.getBalances);
router.get(
  "/optimized-settlements",
  authenticate,
  balanceController.getOptimizedSettlements,
);

module.exports = router;
