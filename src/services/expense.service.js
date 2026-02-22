const { Expense, ExpenseParticipant, User } = require("../models");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

const createExpense = async ({
  name,
  total_amount,
  currency,
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
        currency: currency || "INR",
        date,
        createdBy,
      },
      { transaction },
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

const getExpense = async (expenseId, userId) => {
  try {
    const expense = await Expense.findByPk(expenseId, {
      include: [
        {
          model: ExpenseParticipant,
        },
      ],
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Check if user is part of this expense or created it
    if (expense.createdBy !== userId) {
      const isParticipant = await ExpenseParticipant.findOne({
        where: {
          expenseId,
          userId,
        },
      });
      if (!isParticipant) {
        throw new Error("Unauthorized access to this expense");
      }
    }

    return expense;
  } catch (error) {
    throw error;
  }
};

const getAllExpenses = async (userId) => {
  try {
    // Get expenses created by user or where user is a participant
    const expenses = await Expense.findAll({
      include: [
        {
          model: ExpenseParticipant,
          where: {
            userId: userId,
          },
          required: false, // LEFT JOIN to include expenses created by user too
        },
      ],
      where: {
        [Op.or]: [
          { createdBy: userId },
          { "$ExpenseParticipants.userId$": userId },
        ],
      },
      order: [["createdAt", "DESC"]],
      subQuery: false,
      distinct: true,
    });

    return expenses;
  } catch (error) {
    throw error;
  }
};

const updateExpense = async (
  expenseId,
  { name, total_amount, currency, date, participants, userId },
) => {
  const transaction = await sequelize.transaction();
  try {
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Check authorization - only creator can update
    if (expense.createdBy !== userId) {
      throw new Error("Unauthorized to update this expense");
    }

    // Update expense fields
    if (name) expense.name = name;
    if (total_amount) expense.total_amount = total_amount;
    if (currency) expense.currency = currency;
    if (date) expense.date = date;

    await expense.save({ transaction });

    // Update participants if provided
    if (participants && participants.length > 0) {
      // Delete old participants
      await ExpenseParticipant.destroy(
        {
          where: { expenseId },
        },
        { transaction },
      );

      // Create new participants
      const participantRecords = participants.map((p) => ({
        expenseId,
        userId: p.userId,
        amountOwed: p.amount,
      }));

      await ExpenseParticipant.bulkCreate(participantRecords, {
        transaction,
      });
    }

    await transaction.commit();
    return expense;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteExpense = async (expenseId, userId) => {
  const transaction = await sequelize.transaction();
  try {
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      throw new Error("Expense not found");
    }

    // Check authorization - only creator can delete
    if (expense.createdBy !== userId) {
      throw new Error("Unauthorized to delete this expense");
    }

    // Delete participants first
    await ExpenseParticipant.destroy(
      {
        where: { expenseId },
      },
      { transaction },
    );

    // Delete expense
    await expense.destroy({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createExpense,
  getExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
};
