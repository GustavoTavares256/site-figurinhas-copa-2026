const { createOrder } = require("../services/orderService");

async function checkout(req, res) {
  const { items, customer, couponCode } = req.body;
  const order = await createOrder(items, customer, couponCode);

  return res.status(201).json({
    message: "Pedido criado com sucesso.",
    order
  });
}

module.exports = {
  checkout
};
