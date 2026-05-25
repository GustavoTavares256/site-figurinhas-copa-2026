const connection = require("../database/connection");

function createOrder(items) {

  return new Promise((resolve, reject) => {

    const total = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    connection.query(
      "INSERT INTO orders (total, status) VALUES (?, ?)",
      [total, "pending"],
      (error, result) => {

        if (error) {
          reject(error);
          return;
        }

        const orderId = result.insertId;

        const orderItems = items.map(item => [
          orderId,
          item.name,
          item.quantity,
          item.price
        ]);

        connection.query(
          "INSERT INTO order_items (order_id, product_name, quantity, price) VALUES ?",
          [orderItems],
          async (error) => {

            if (error) {
              reject(error);
              return;
            }

            try {

              for (const item of items) {

                await decreaseStock(
                  item.id,
                  item.quantity
                );

              }

              resolve({
                id: orderId,
                total,
                status: "pending",
                items
              });

            } catch (error) {

              reject(error);

            }

          }
        );

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

        if (error) {
          reject(error);
          return;
        }

        if (result.affectedRows === 0) {

          reject(
            new Error("Estoque insuficiente.")
          );

          return;
        }

        resolve();

      }
    );

  });

}

module.exports = {
  createOrder
};