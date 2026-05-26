const searchOrdersForm = document.getElementById("searchOrdersForm");
const phoneInput = document.getElementById("phoneInput");
const customerOrdersList = document.getElementById("customerOrdersList");

function formatCurrency(value) {
  return Number(value).toFixed(2).replace(".", ",");
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function getStatusLabel(status) {
  const statusMap = {
    pending: "Pedido recebido",
    paid: "Pagamento aprovado",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado"
  };

  return statusMap[status] || status;
}

searchOrdersForm.addEventListener("submit", async event => {
  event.preventDefault();

  const phone = phoneInput.value.replace(/\D/g, "");

  if (!phone) {
    alert("Digite seu telefone.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/orders/customer/${encodeURIComponent(phone)}`
    );

    const orders = await response.json();

    customerOrdersList.innerHTML = "";

    if (!response.ok) {
      alert(orders.message || "Erro ao buscar pedidos.");
      return;
    }

    if (orders.length === 0) {
      customerOrdersList.innerHTML = `
        <p class="empty-orders">
          Nenhum pedido encontrado para esse telefone.
        </p>
      `;
      return;
    }

    orders.forEach(order => {
      const card = document.createElement("article");
      card.classList.add("customer-order-card");

      card.innerHTML = `
        <div class="order-top">
          <div>
            <h2>Pedido #${order.id}</h2>
            <p>${formatDate(order.created_at)}</p>
          </div>

          <span class="order-status">
            ${getStatusLabel(order.status)}
          </span>
        </div>

        <ul>
          ${order.items.map(item => `
            <li>
              ${item.quantity}x ${item.product_name}
              <strong>R$ ${formatCurrency(item.price)}</strong>
            </li>
          `).join("")}
        </ul>

        <div class="order-total">
          Total: R$ ${formatCurrency(order.total)}
        </div>
      `;

      customerOrdersList.appendChild(card);
    });

  } catch (error) {
    console.log(error);
    alert("Erro ao buscar pedidos.");
  }
});