const { Expense, ExpenseParticipant } = require("../models");
const sequelize = require("../config/db");
const createExpense = async ({
  name,
  total_amount,
  date,
  participants,
  createdBy,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const expense = await Expense.create(
      {
        name,
        total_amount,
        date,
        createdBy,
      },
      { transaction }
    );
    const participantRecords = participants.map((p) => ({
      expenseId: expense.id,
      userId: p.userId,
      amountOwed: p.amount,
    }));

    await ExpenseParticipant.bulkCreate(participantRecords, {
      transaction,
    });

    await transaction.commit();
    return expense;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createExpense,
};