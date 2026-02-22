const balanceService = require("../services/balance.service");

const getBalances = async (req, res) => {
  try {
    const userId = req.user.id;
    const balances = await balanceService.getBalancesForUser(userId);

    return res.status(200).json({
      message: "Balances retrieved successfully",
      userId,
      balances,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getBalances };
