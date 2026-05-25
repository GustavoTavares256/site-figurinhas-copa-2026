const {
  createOrder
} = require("../services/orderService");

async function checkout(req, res) {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Carrinho vazio."
      });
    }

    const order = await createOrder(items);

    return res.status(201).json({
      message: "Pedido criado com sucesso!",
      order
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao criar pedido."
    });
  }
}

module.exports = {
  checkout
};