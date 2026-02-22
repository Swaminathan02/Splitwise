const balanceService = require("../services/balance.service");
const getBalances = async (req, res) => {
  try {
    const settlements = await balanceService.calculateBalances();
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getBalances };