const connection = require("../database/connection");
const AppError = require("../utils/AppError");

const ALLOWED_STATUS = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled"
];

async function updateOrderStatus(id, status) {
  if (!ALLOWED_STATUS.includes(status)) {
    throw new AppError("Status invalido.", 400, "INVALID_STATUS");
  }

  const [result] = await connection.execute(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Pedido nao encontrado.", 404, "ORDER_NOT_FOUND");
  }

  return {
    id: Number(id),
    status
  };
}

module.exports = {
  ALLOWED_STATUS,
  updateOrderStatus
};
