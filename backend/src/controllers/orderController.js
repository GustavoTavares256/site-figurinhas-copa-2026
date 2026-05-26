const {
  createOrder
} = require("../services/orderService");

const {
  sendOrderEmail
} = require("../services/emailService");

async function checkout(req, res) {
  try {
    console.log("Checkout recebido:", req.body);

    const { items, customer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Carrinho vazio."
      });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        message: "Preencha todos os dados."
      });
    }

    const order = await createOrder(items, customer);

    try {
      await sendOrderEmail(customer.email, customer.name);
    } catch (emailError) {
      console.log("Erro ao enviar email:", emailError.message);
    }

    return res.status(201).json({
      message: "Pedido criado com sucesso.",
      order
    });

  } catch (error) {
    console.log("Erro checkout:", error);

    return res.status(500).json({
      message: error.message || "Erro interno do servidor."
    });
  }
}

module.exports = {
  checkout
};