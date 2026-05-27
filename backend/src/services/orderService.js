const connection = require("../database/connection");

function createOrder(items, customer) {
  return new Promise((resolve, reject) => {
    const total = items.reduce((acc, item) => {
      return acc + Number(item.price) * Number(item.quantity || 1);
    }, 0);

    const orderSql = `
      INSERT INTO orders
      (customer_name, customer_email, customer_phone, customer_address, total, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      orderSql,
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
        total,
        "pending"
      ],
      (error, result) => {
        if (error) return reject(error);

        const orderId = result.insertId;

        const orderItems = items.map((item) => [
          orderId,
          item.name,
          Number(item.quantity || 1),
          Number(item.price)
        ]);

        const itemsSql = `
          INSERT INTO order_items
          (order_id, product_name, quantity, price)
          VALUES ?
        `;

        connection.query(itemsSql, [orderItems], async (error) => {
          if (error) return reject(error);

          try {
            for (const item of items) {
              await decreaseStock(item.id, Number(item.quantity || 1));
            }

            resolve({
              id: orderId,
              customer,
              total,
              status: "pending",
              items
            });
          } catch (stockError) {
            reject(stockError);
          }
        });
      }
    );
  });
}

function decreaseStock(productId, quantity) {
  return new Promise((resolve, reject) => {
    connection.query(
      `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?
      `,
      [quantity, productId, quantity],
      (error, result) => {
        if (error) return reject(error);

        if (result.affectedRows === 0) {
          return reject(new Error("Estoque insuficiente."));
        }

        resolve();
      }
    );
  });
}

module.exports = {
  createOrder
};