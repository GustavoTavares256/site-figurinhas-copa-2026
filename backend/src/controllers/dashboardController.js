const {
  getDashboardData
} = require("../services/dashboardService");

async function getDashboard(req, res) {
  try {
    const data = await getDashboardData();

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao buscar dados do dashboard."
    });
  }
}

module.exports = {
  getDashboard
};