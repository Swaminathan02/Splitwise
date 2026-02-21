const User = require("./user.model");
const Expense = require("./expense.model");
const ExpenseParticipant = require("./expenseParticipant.model");

// User creates many expenses
User.hasMany(Expense, { foreignKey: "createdBy" });
Expense.belongsTo(User, { foreignKey: "createdBy" });

// Expense has many participants
Expense.hasMany(ExpenseParticipant, { foreignKey: "expenseId" });
ExpenseParticipant.belongsTo(Expense, { foreignKey: "expenseId" });

// User participates in many expenses
User.hasMany(ExpenseParticipant, { foreignKey: "userId" });
ExpenseParticipant.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Expense,
  ExpenseParticipant,
};