const connection = require("../database/connection");

function groupOrders(rows) {
  const orders = [];

  rows.forEach((row) => {
    let order = orders.find((item) => item.id === row.order_id);

    if (!order) {
      order = {
        id: row.order_id,
        subtotal: row.subtotal,
        discount: row.discount,
        total: row.total,
        status: row.status,
        created_at: row.created_at,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
          phone: row.customer_phone,
          address: row.customer_address
        },
        items: []
      };

      orders.push(order);
    }

    if (row.item_id) {
      order.items.push({
        id: row.item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.unit_price,
        line_total: row.line_total
      });
    }
  });

  return orders;
}

async function getAllOrders(status = null) {
  const params = [];
  const clauses = [];

  if (status && status !== "all") {
    clauses.push("o.status = ?");
    params.push(status);
  }

  const [rows] = await connection.execute(
    `
      SELECT
        o.id AS order_id,
        o.subtotal,
        o.discount,
        o.total,
        o.status,
        o.created_at,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        c.address AS customer_address,
        oi.id AS item_id,
        oi.product_id,
        oi.product_name,
        oi.quantity,
        oi.unit_price,
        oi.line_total
      FROM orders o
      INNER JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      ${clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""}
      ORDER BY o.id DESC
    `,
    params
  );

  return groupOrders(rows);
}

module.exports = {
  getAllOrders,
  groupOrders
};
