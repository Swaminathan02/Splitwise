const { Expense, ExpenseParticipant, User } = require("../models");

const getBalancesForUser = async (userId) => {
  try {
    // Get all expenses where the user is either the creator or a participant
    const expenses = await Expense.findAll({
      include: [
        {
          model: ExpenseParticipant,
          required: false,
        },
      ],
    });

    // Initialize balance map to track balance between current user and other users
    const balanceMap = {}; // { otherUserId: amount }

    // Process each expense
    for (let expense of expenses) {
      const payer = expense.createdBy;

      // Check if current user is involved in this expense
      const isUserInvolved =
        payer === userId ||
        expense.ExpenseParticipants.some((p) => p.userId === userId);

      if (!isUserInvolved) continue;

      // For each participant in the expense
      for (let participant of expense.ExpenseParticipants) {
        const otherUserId = participant.userId;
        const amountOwed = parseFloat(participant.amountOwed);

        if (!balanceMap[otherUserId]) {
          balanceMap[otherUserId] = 0;
        }

        // If current user is the payer, other user owes them
        if (payer === userId) {
          balanceMap[otherUserId] += amountOwed;
        }
        // If other user is the payer, current user owes them
        else if (payer === otherUserId) {
          balanceMap[otherUserId] -= amountOwed;
        }
      }
    }

    // Get user details for all users in the balance map
    const userIds = Object.keys(balanceMap).map(Number);
    const otherUsers = await User.findAll({
      where: {
        id: userIds,
      },
    });

    const userDetails = {};
    otherUsers.forEach((user) => {
      userDetails[user.id] = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    });

    // Build final balance array with user details
    const balances = [];
    for (let otherUserId in balanceMap) {
      const amount = balanceMap[otherUserId];
      if (amount !== 0) {
        // Only show non-zero balances
        balances.push({
          user: userDetails[otherUserId],
          balance: amount,
          status:
            amount > 0
              ? `${userDetails[otherUserId].name} owes you ₹${amount.toFixed(2)}`
              : `You owe ${userDetails[otherUserId].name} ₹${Math.abs(amount).toFixed(2)}`,
        });
      }
    }

    // Sort by absolute amount (descending)
    balances.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

    return balances;
  } catch (error) {
    throw error;
  }
};

const calculateBalances = async () => {
  const expenses = await Expense.findAll({
    include: [ExpenseParticipant],
  });

  const users = await User.findAll();
  const userMap = {};

  users.forEach((user) => {
    userMap[user.id] = {
      id: user.id,
      email: user.email,
    };
  });

  const balanceMap = {};

  // Step 1: Calculate net balances
  for (let expense of expenses) {
    const payer = expense.createdBy;
    const total = expense.total_amount;

    balanceMap[payer] = (balanceMap[payer] || 0) + total;

    for (let participant of expense.ExpenseParticipants) {
      balanceMap[participant.userId] =
        (balanceMap[participant.userId] || 0) - participant.amountOwed;
    }
  }

  const creditors = [];
  const debtors = [];

  for (let userId in balanceMap) {
    const amount = balanceMap[userId];

    if (amount > 0) {
      creditors.push({ userId: Number(userId), amount });
    } else if (amount < 0) {
      debtors.push({ userId: Number(userId), amount: Math.abs(amount) });
    }
  }

  const settlements = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settleAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: userMap[debtor.userId],
      to: userMap[creditor.userId],
      amount: settleAmount,
    });

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return settlements;
};

module.exports = {
  getBalancesForUser,
  calculateBalances,
};
