const {
  getAllOrders
} = require("../services/orderAdminService");

async function listOrders(req, res) {
  try {
    const orders = await getAllOrders();

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao buscar pedidos."
    });
  }
}

module.exports = {
  listOrders
};