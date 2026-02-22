const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const authenticate = require("../middleware/auth.middleware");

// Create expense
router.post("/", authenticate, expenseController.createExpense);

// Get all expenses for user
router.get("/", authenticate, expenseController.getAllExpenses);

// Get single expense
router.get("/:id", authenticate, expenseController.getExpense);

// Update expense
router.put("/:id", authenticate, expenseController.updateExpense);

// Delete expense
router.delete("/:id", authenticate, expenseController.deleteExpense);

module.exports = router;
