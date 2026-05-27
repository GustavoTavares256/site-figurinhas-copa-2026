const API_URL = "https://site-figurinhas-copa-2026.onrender.com";

const searchOrdersForm = document.getElementById("searchOrdersForm");
const phoneInput = document.getElementById("phoneInput");
const customerOrdersList = document.getElementById("customerOrdersList");

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  });
}

function formatDate(date) {
  if (!date) return "Data não disponível";

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function normalizePhone(phone) {
  return phone.replace(/\D/g, "");
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
    {
      key: "pending",
      label: "Recebido"
    },
    {
      key: "paid",
      label: "Pago"
    },
    {
      key: "shipped",
      label: "Enviado"
    },
    {
      key: "delivered",
      label: "Entregue"
    }
  ];

  const statusOrder = {
    pending: 0,
    paid: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1
  };

  const currentIndex = statusOrder[status] ?? 0;

  if (status === "cancelled") {
    return `
      <div class="order-timeline">
        <div class="timeline-step active">
          Cancelado
        </div>
      </div>
    `;
  }

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

function showLoading() {
  customerOrdersList.innerHTML = `
    <p class="empty-orders">
      Buscando seus pedidos...
    </p>
  `;
}

function showEmpty(message) {
  customerOrdersList.innerHTML = `
    <p class="empty-orders">
      ${message}
    </p>
  `;
}

function renderOrders(orders) {
  customerOrdersList.innerHTML = "";

  if (!Array.isArray(orders) || orders.length === 0) {
    showEmpty("Nenhum pedido encontrado para esse telefone.");
    return;
  }

  orders.forEach(order => {
    const card = document.createElement("article");
    card.classList.add("customer-order-card");

    const items = Array.isArray(order.items) ? order.items : [];

    card.innerHTML = `
      <div class="order-top">
        <div>
          <h2>Pedido #${order.id}</h2>
          <p>Criado em ${formatDate(order.created_at)}</p>
        </div>

        <span class="order-status">
          ${getStatusLabel(order.status)}
        </span>
      </div>

      ${getTimelineSteps(order.status)}

      ${
        order.customer
          ? `
            <div class="order-customer">
              <p><strong>Cliente:</strong> ${order.customer.name || "Não informado"}</p>
              <p><strong>Telefone:</strong> ${order.customer.phone || "Não informado"}</p>
              <p><strong>Endereço:</strong> ${order.customer.address || "Não informado"}</p>
            </div>
          `
          : ""
      }

      <ul>
        ${items.map(item => `
          <li>
            <span>
              ${item.quantity}x ${item.product_name}
            </span>

            <strong>
              R$ ${formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}
            </strong>
          </li>
        `).join("")}
      </ul>

      <div class="order-total">
        Total: R$ ${formatCurrency(order.total)}
      </div>
    `;

    customerOrdersList.appendChild(card);
  });
}

searchOrdersForm.addEventListener("submit", async event => {
  event.preventDefault();

  const phone = normalizePhone(phoneInput.value);

  if (phone.length < 8) {
    showEmpty("Digite um telefone válido para buscar seus pedidos.");
    return;
  }

  localStorage.setItem("lastOrderPhone", phone);

  showLoading();

  try {
    const response = await fetch(`${API_URL}/${phone}`);

    const data = await response.json();

    if (!response.ok) {
      showEmpty(data.message || "Erro ao buscar pedidos.");
      return;
    }

    renderOrders(data);

  } catch (error) {
    console.log("Erro ao buscar pedidos:", error);

    showEmpty(
      "Erro ao conectar com o servidor. Verifique se o backend está rodando."
    );
  }
});

const savedPhone = localStorage.getItem("lastOrderPhone");

if (savedPhone) {
  phoneInput.value = savedPhone;
}