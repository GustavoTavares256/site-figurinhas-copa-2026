const searchOrdersForm = document.getElementById("searchOrdersForm");
const phoneInput = document.getElementById("phoneInput");
const customerOrdersList = document.getElementById("customerOrdersList");

function formatDate(date) {
  if (!date) return "Data nao disponivel";

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function getStatusLabel(status) {
  const labels = {
    pending: "Pedido recebido",
    paid: "Pagamento aprovado",
    shipped: "Pedido enviado",
    delivered: "Pedido entregue",
    cancelled: "Pedido cancelado"
  };

  return labels[status] || "Status desconhecido";
}

function getTimelineSteps(status) {
  const steps = [
    { key: "pending", label: "Recebido" },
    { key: "paid", label: "Pago" },
    { key: "shipped", label: "Enviado" },
    { key: "delivered", label: "Entregue" }
  ];

  const statusOrder = {
    pending: 0,
    paid: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1
  };

  if (status === "cancelled") {
    return '<div class="order-timeline"><div class="timeline-step active">Cancelado</div></div>';
  }

  const currentIndex = statusOrder[status] ?? 0;

  return `
    <div class="order-timeline">
      ${steps.map((step, index) => `
        <div class="timeline-step ${index <= currentIndex ? "active" : ""}">
          ${step.label}
        </div>
      `).join("")}
    </div>
  `;
}

function showEmpty(message) {
  customerOrdersList.innerHTML = `<p class="empty-orders">${message}</p>`;
}

function renderOrders(orders) {
  customerOrdersList.innerHTML = "";

  if (!Array.isArray(orders) || orders.length === 0) {
    showEmpty("Nenhum pedido encontrado para esse telefone.");
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("article");
    card.classList.add("customer-order-card");

    card.innerHTML = `
      <div class="order-top">
        <div>
          <h2>Pedido #${order.id}</h2>
          <p>Criado em ${formatDate(order.created_at)}</p>
        </div>
        <span class="order-status">${getStatusLabel(order.status)}</span>
      </div>
      ${getTimelineSteps(order.status)}
      <div class="order-customer">
        <p><strong>Cliente:</strong> ${order.customer?.name || "Nao informado"}</p>
        <p><strong>Telefone:</strong> ${order.customer?.phone || "Nao informado"}</p>
        <p><strong>Endereco:</strong> ${order.customer?.address || "Nao informado"}</p>
      </div>
      <ul>
        ${(order.items || []).map((item) => `
          <li>
            <span>${item.quantity}x ${item.product_name}</span>
            <strong>R$ ${formatCurrency(item.line_total || item.price * item.quantity)}</strong>
          </li>
        `).join("")}
      </ul>
      <div class="order-total">Total: R$ ${formatCurrency(order.total)}</div>
    `;

    customerOrdersList.appendChild(card);
  });
}

searchOrdersForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const phone = normalizePhone(phoneInput.value);

  if (phone.length < 8) {
    showEmpty("Digite um telefone valido para buscar seus pedidos.");
    return;
  }

  localStorage.setItem("lastOrderPhone", phone);
  customerOrdersList.innerHTML = '<p class="empty-orders">Buscando seus pedidos...</p>';

  try {
    renderOrders(await apiFetch(`/orders/customer/${phone}`));
  } catch (error) {
    showEmpty(error.message || "Erro ao buscar pedidos.");
  }
});

const savedPhone = localStorage.getItem("lastOrderPhone");

if (savedPhone) {
  phoneInput.value = savedPhone;
}
