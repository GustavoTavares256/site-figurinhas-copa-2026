const { deleteOrder } = require("../services/orderCrudService");

async function removeOrder(req, res) {
  const result = await deleteOrder(req.params.id);
  return res.status(200).json(result);
}

module.exports = {
  removeOrder
};
