const {
  getOrdersByPhone
} = require("../services/customerOrderService");

async function listCustomerOrders(req, res) {
  try {
    const { phone } = req.params;

    const orders = await getOrdersByPhone(phone);

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao buscar pedidos do cliente."
    });
  }
}

module.exports = {
  listCustomerOrders
};