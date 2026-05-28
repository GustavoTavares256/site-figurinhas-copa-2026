const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");

const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
const couponCode = localStorage.getItem("checkoutCoupon") || null;

function renderCheckout() {
  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Seu carrinho esta vazio.</p>";
    checkoutTotal.textContent = "0,00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += Number(item.price || 0) * Number(item.quantity || 1);

    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <h3>${item.name}</h3>
        <p>Quantidade: ${item.quantity}</p>
        <p>Preco: R$ ${formatCurrency(item.price)}</p>
      </div>
    `;
  });

  if (couponCode === "COPA10") {
    total *= 0.9;
  }

  checkoutTotal.textContent = formatCurrency(total);
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

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

  try {
    const button = checkoutForm.querySelector("button");
    button.disabled = true;
    button.textContent = "Criando pedido...";

    const data = await apiFetch("/checkout", {
      method: "POST",
      body: JSON.stringify({
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity
        })),
        customer,
        couponCode
      })
    });

    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutCart");
    localStorage.removeItem("checkoutCoupon");
    localStorage.setItem("lastOrderId", data.order.id);
    localStorage.setItem("lastOrderPhone", customer.phone.replace(/\D/g, ""));

    window.location.href = "success.html";
  } catch (error) {
    alert(error.message || "Erro ao criar pedido.");
    const button = checkoutForm.querySelector("button");
    button.disabled = false;
    button.textContent = "Confirmar pedido";
  }
});

renderCheckout();
