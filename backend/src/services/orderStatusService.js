const connection = require("../database/connection");

function updateOrderStatus(id, status) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id],
      (error) => {
        if (error) return reject(error);

        resolve({
          id,
          status
        });
      }
    );
  });
}

module.exports = {
  updateOrderStatus
};