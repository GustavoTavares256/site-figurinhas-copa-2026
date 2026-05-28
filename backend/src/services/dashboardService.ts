const dashboardRepository = require("../repositories/dashboardRepository");

async function getDashboardData() {
  const [
    summary,
    statusRows,
    revenueByDay,
    topProducts,
    latestOrders,
    lowStockItems
  ] = await Promise.all([
    dashboardRepository.getSummary(),
    dashboardRepository.getOrdersByStatus(),
    dashboardRepository.getRevenueByDay(7),
    dashboardRepository.getTopProducts(5),
    dashboardRepository.getLatestOrders(6),
    dashboardRepository.getLowStockItems(8)
  ]);

  return {
    ...summary,
    ordersByStatus: statusRows,
    revenueByDay,
    topProducts,
    latestOrders,
    lowStockItems
  };
}

module.exports = {
  getDashboardData
};
