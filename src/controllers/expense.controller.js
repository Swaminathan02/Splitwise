const expenseService = require("../services/expense.service");
const createExpense = async (req, res) => {
  try {
    const { name, total_amount, date, participants } = req.body;
    const expense = await expenseService.createExpense({
      name,
      total_amount,
      date,
      participants,
      createdBy: req.user.id,
    });
    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
};