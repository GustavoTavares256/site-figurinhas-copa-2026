const connection = require("../database/connection");
const AppError = require("../utils/AppError");

async function deleteOrder(id) {
  const [result] = await connection.execute(
    "DELETE FROM orders WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Pedido nao encontrado.", 404, "ORDER_NOT_FOUND");
  }

  return {
    message: "Pedido deletado com sucesso."
  };
}

module.exports = {
  deleteOrder
};
