const expenseService = require("../services/expense.service");

const createExpense = async (req, res) => {
  try {
    const { name, total_amount, currency, date, participants } = req.body;

    // Validate required fields
    if (
      !name ||
      !total_amount ||
      !date ||
      !participants ||
      participants.length === 0
    ) {
      return res.status(400).json({
        message: "Name, total_amount, date, and participants are required",
      });
    }

    const expense = await expenseService.createExpense({
      name,
      total_amount,
      currency,
      date,
      participants,
      createdBy: req.user.id,
    });
    return res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseService.getExpense(id, req.user.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json(expense);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.user.id);
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, total_amount, currency, date, participants } = req.body;

    const expense = await expenseService.updateExpense(id, {
      name,
      total_amount,
      currency,
      date,
      participants,
      userId: req.user.id,
    });

    return res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await expenseService.deleteExpense(id, req.user.id);

    return res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
};
