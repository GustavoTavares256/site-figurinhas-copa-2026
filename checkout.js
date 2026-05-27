const CHECKOUT_URL = "http://localhost:3000/checkout";

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");

const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

function formatCurrency(value) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function renderCheckout() {
  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <p>Seu carrinho está vazio.</p>
    `;

    checkoutTotal.textContent = "0,00";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += Number(item.price || 0) * Number(item.quantity || 1);

    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <h3>${item.name}</h3>
        <p>Quantidade: ${item.quantity}</p>
        <p>Preço: R$ ${formatCurrency(item.price)}</p>
      </div>
    `;
  });

  checkoutTotal.textContent = formatCurrency(total);
}

checkoutForm.addEventListener("submit", async event => {
  event.preventDefault();

  console.log("Botão confirmar clicado");

  if (cart.length === 0) {
    alert("Carrinho vazio. Volte para a loja.");
    window.location.href = "index.html";
    return;
  }

  const customer = {
    name: customerName.value.trim(),
    email: customerEmail.value.trim(),
    phone: customerPhone.value.trim(),
    address: customerAddress.value.trim()
  };

  console.log("Cliente:", customer);
  console.log("Carrinho enviado:", cart);

  try {
    const response = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: cart,
        customer
      })
    });

    const data = await response.json();

    console.log("Resposta do backend:", data);

    if (!response.ok) {
      alert(data.message || "Erro ao criar pedido.");
      return;
    }

    localStorage.removeItem("checkoutCart");

    window.location.href = "success.html";

  } catch (error) {
    console.log("Erro completo:", error);
    alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
  }
});

renderCheckout();