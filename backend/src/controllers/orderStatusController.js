const {
  updateOrderStatus
} = require("../services/orderStatusService");

async function changeOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Status inválido."
      });
    }

    const order = await updateOrderStatus(id, status);

    return res.status(200).json({
      message: "Status atualizado com sucesso!",
      order
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao atualizar status."
    });
  }
}

module.exports = {
  changeOrderStatus
};