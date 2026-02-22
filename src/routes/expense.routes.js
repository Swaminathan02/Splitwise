const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/", authenticate, expenseController.createExpense);
module.exports = router;