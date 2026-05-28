const connection = require("../database/connection");
const { normalizePhone } = require("../utils/validators");
const { groupOrders } = require("./orderAdminService");

async function getOrdersByPhone(phone) {
  const normalizedPhone = normalizePhone(phone);

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
      WHERE c.phone = ?
      ORDER BY o.id DESC
    `,
    [normalizedPhone]
  );

  return groupOrders(rows);
}

module.exports = {
  getOrdersByPhone
};
