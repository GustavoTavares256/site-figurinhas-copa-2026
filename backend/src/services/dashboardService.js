const connection = require("../database/connection");

function getDashboardData() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM orders) AS totalOrders,
        (SELECT IFNULL(SUM(total), 0) FROM orders) AS totalRevenue,
        (SELECT COUNT(*) FROM products) AS totalProducts,
        (SELECT COUNT(*) FROM products WHERE stock <= 5) AS lowStockProducts
    `;

    connection.query(query, (error, results) => {
      if (error) return reject(error);

      resolve(results[0]);
    });
  });
}

module.exports = {
  getDashboardData
};