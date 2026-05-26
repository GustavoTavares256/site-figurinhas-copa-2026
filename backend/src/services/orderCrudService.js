const connection = require("../database/connection");

function deleteOrder(id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM order_items WHERE order_id = ?",
      [id],
      error => {
        if (error) return reject(error);

        connection.query(
          "DELETE FROM orders WHERE id = ?",
          [id],
          error => {
            if (error) return reject(error);

            resolve({
              message: "Pedido deletado com sucesso."
            });
          }
        );
      }
    );
  });
}

module.exports = {
  deleteOrder
};