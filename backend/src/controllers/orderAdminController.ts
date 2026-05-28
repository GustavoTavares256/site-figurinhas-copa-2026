const { getAllOrders } = require("../services/orderAdminService");

async function listOrders(req, res) {
  const orders = await getAllOrders(req.query.status);
  return res.status(200).json(orders);
}

module.exports = {
  listOrders
};
