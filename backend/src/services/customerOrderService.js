const connection = require("../database/connection");

function normalizePhone(phone) {
  return String(phone).replace(/\D/g, "");
}

function getOrdersByPhone(phone) {
  return new Promise((resolve, reject) => {
    const normalizedPhone = normalizePhone(phone);

    const query = `
      SELECT
        orders.id AS order_id,
        orders.total,
        orders.status,
        orders.created_at,
        customers.name AS customer_name,
        customers.email,
        customers.phone,
        customers.address,
        order_items.product_name,
        order_items.quantity,
        order_items.price
      FROM orders
      INNER JOIN customers ON orders.customer_id = customers.id
      LEFT JOIN order_items ON orders.id = order_items.order_id
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(customers.phone, ' ', ''), '-', ''), '(', ''), ')', '') = ?
      ORDER BY orders.id DESC
    `;

    connection.query(query, [normalizedPhone], (error, results) => {
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
            customer: {
              name: row.customer_name,
              email: row.email,
              phone: row.phone,
              address: row.address
            },
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
  getOrdersByPhone
};