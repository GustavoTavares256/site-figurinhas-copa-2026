const connection = require("../database/connection");

function getAllOrders() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        orders.id AS order_id,
        orders.total,
        orders.status,
        orders.created_at,
        order_items.product_name,
        order_items.quantity,
        order_items.price
      FROM orders
      LEFT JOIN order_items
        ON orders.id = order_items.order_id
      ORDER BY orders.id DESC
    `;

    connection.query(query, (error, results) => {
      if (error) return reject(error);

      const orders = [];

      results.forEach(row => {
        let order = orders.find(item => item.id === row.order_id);

        if (!order) {
          order = {
            id: row.order_id,
            total: row.total,
            status: row.status,
            created_at: row.created_at,
            items: []
          };

          orders.push(order);
        }

        if (row.product_name) {
          order.items.push({
            product_name: row.product_name,
            quantity: row.quantity,
            price: row.price
          });
        }
      });

      resolve(orders);
    });
  });
}

module.exports = {
  getAllOrders
};