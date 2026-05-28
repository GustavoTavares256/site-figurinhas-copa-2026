const { getDashboardData } = require("../services/dashboardService");

async function getDashboard(req, res) {
  const data = await getDashboardData();
  return res.status(200).json(data);
}

module.exports = {
  getDashboard
};
