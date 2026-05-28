const connection = require("../database/connection");

async function getSummary() {
  const [rows] = await connection.execute(`
    SELECT
      (SELECT COUNT(*) FROM products WHERE is_active = 1) AS totalProducts,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE()) AS ordersToday,
      (SELECT IFNULL(SUM(total), 0) FROM orders WHERE status <> 'cancelled') AS totalRevenue,
      (SELECT IFNULL(SUM(total), 0) FROM orders WHERE status <> 'cancelled' AND DATE(created_at) = CURRENT_DATE()) AS revenueToday,
      (SELECT IFNULL(SUM(quantity), 0) FROM order_items) AS productsSold,
      (SELECT COUNT(*) FROM products WHERE is_active = 1 AND stock <= 5) AS lowStockProducts
  `);

  return rows[0];
}

async function getOrdersByStatus() {
  const [rows] = await connection.execute(`
    SELECT status, COUNT(*) AS total
    FROM orders
    GROUP BY status
  `);

  return rows;
}

async function getRevenueByDay(days = 7) {
  const [rows] = await connection.execute(
    `
      SELECT DATE(created_at) AS date, IFNULL(SUM(total), 0) AS revenue, COUNT(*) AS orders
      FROM orders
      WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL ? DAY)
        AND status <> 'cancelled'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
    [days]
  );

  return rows;
}

async function getTopProducts(limit = 5) {
  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 50);
  const [rows] = await connection.execute(
    `
      SELECT
        oi.product_id,
        oi.product_name AS name,
        SUM(oi.quantity) AS totalSold,
        SUM(oi.line_total) AS revenue
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      WHERE o.status <> 'cancelled'
      GROUP BY oi.product_id, oi.product_name
      ORDER BY totalSold DESC
      LIMIT ${safeLimit}
    `
  );

  return rows;
}

async function getLatestOrders(limit = 6) {
  const safeLimit = Math.min(Math.max(Number(limit) || 6, 1), 50);
  const [rows] = await connection.execute(
    `
      SELECT
        o.id,
        o.total,
        o.status,
        o.created_at,
        c.name AS customer_name,
        c.phone AS customer_phone
      FROM orders o
      INNER JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT ${safeLimit}
    `
  );

  return rows;
}

async function getLowStockItems(limit = 8) {
  const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), 50);
  const [rows] = await connection.execute(
    `
      SELECT id, name, category, stock
      FROM products
      WHERE is_active = 1 AND stock <= 5
      ORDER BY stock ASC, name ASC
      LIMIT ${safeLimit}
    `
  );

  return rows;
}

module.exports = {
  getSummary,
  getOrdersByStatus,
  getRevenueByDay,
  getTopProducts,
  getLatestOrders,
  getLowStockItems
};
