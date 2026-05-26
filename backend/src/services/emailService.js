const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "SEU_EMAIL@gmail.com",
    pass: "SENHA_DE_APP_DO_GOOGLE"
  }
});

async function sendOrderEmail(customerEmail, customerName) {
  if (!customerEmail) return;

  await transporter.sendMail({
    from: "Copa Stickers <SEU_EMAIL@gmail.com>",
    to: customerEmail,
    subject: "Pedido recebido - Copa Stickers",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h1>Pedido recebido!</h1>
        <p>Olá, ${customerName}.</p>
        <p>Recebemos seu pedido com sucesso.</p>
        <p>Em breve entraremos em contato para combinar pagamento e entrega.</p>
      </div>
    `
  });
}

module.exports = {
  sendOrderEmail
};