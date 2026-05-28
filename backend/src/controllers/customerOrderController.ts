const { getOrdersByPhone } = require("../services/customerOrderService");

async function listCustomerOrders(req, res) {
  const orders = await getOrdersByPhone(req.params.phone);
  return res.status(200).json(orders);
}

module.exports = {
  listCustomerOrders
};
