const {
  deleteOrder
} = require("../services/orderCrudService");

async function removeOrder(req, res) {
  try {
    const { id } = req.params;

    const result = await deleteOrder(id);

    return res.status(200).json(result);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao deletar pedido."
    });
  }
}

module.exports = {
  removeOrder
};