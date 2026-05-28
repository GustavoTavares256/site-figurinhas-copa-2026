const { updateOrderStatus } = require("../services/orderStatusService");

async function changeOrderStatus(req, res) {
  const order = await updateOrderStatus(req.params.id, req.body.status);

  return res.status(200).json({
    message: "Status atualizado com sucesso.",
    order
  });
}

module.exports = {
  changeOrderStatus
};
