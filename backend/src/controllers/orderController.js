const connection = require("../database/connection");

function createOrder(items, customer) {
  return new Promise((resolve, reject) => {
    const total = items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity || 1);
    }, 0);

    const orderSql = `
      INSERT INTO orders
      (customer_name, customer_email, customer_phone, customer_address, total)
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
      orderSql,
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
        total
      ],
      (error, result) => {
        if (error) return reject(error);

        const orderId = result.insertId;

        const itemValues = items.map((item) => [
          orderId,
          item.name,
          item.quantity || 1,
          item.price
        ]);

        const itemsSql = `
          INSERT INTO order_items
          (order_id, product_name, quantity, price)
          VALUES ?
        `;

        connection.query(itemsSql, [itemValues], (itemsError) => {
          if (itemsError) return reject(itemsError);

          resolve({
            id: orderId,
            customer,
            items,
            total
          });
        });
      }
    );
  });
}

module.exports = {
  createOrder
};