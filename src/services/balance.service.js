const { Expense, ExpenseParticipant, User } = require("../models");

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
  calculateBalances,
};