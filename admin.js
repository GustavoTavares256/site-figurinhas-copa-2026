const API_URL = "http://localhost:3000/products";
const DASHBOARD_URL = "http://localhost:3000/dashboard";
const ORDERS_URL = "http://localhost:3000/admin/orders";

const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "login.html";
}

const productForm = document.getElementById("productForm");
const productsGrid = document.getElementById("productsGrid");
const ordersList = document.getElementById("ordersList");
const logoutBtn = document.getElementById("logoutBtn");
const submitButton = document.getElementById("submitButton");
const formTitle = document.getElementById("formTitle");

const productsCount = document.getElementById("productsCount");
const ordersCount = document.getElementById("ordersCount");
const revenueValue = document.getElementById("revenueValue");
const lowStockCount = document.getElementById("lowStockCount");

const searchProducts = document.getElementById("searchProducts");
const statusFilter = document.getElementById("statusFilter");

const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");

let editingProductId = null;
let allOrders = [];
let salesChart = null;

function showToast(message, success = true) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: success ? "#00c853" : "#ff3b3b",
      borderRadius: "14px",
      fontWeight: "700"
    }
  }).showToast();
}

function formatCurrency(value) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function getStatusLabel(status) {
  const labels = {
    pending: "Recebido",
    paid: "Pago",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado"
  };

  return labels[status] || status;
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminName");
  window.location.href = "login.html";
});

imageInput.addEventListener("change", event => {
  const file = event.target.files[0];

  if (!file) return;

  previewImage.src = URL.createObjectURL(file);
  previewImage.style.display = "block";
});

async function loadDashboard() {
  try {
    const response = await fetch(DASHBOARD_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    productsCount.textContent = data.totalProducts || 0;
    ordersCount.textContent = data.totalOrders || 0;
    revenueValue.textContent = `R$ ${formatCurrency(data.totalRevenue || 0)}`;
    lowStockCount.textContent = data.lowStockProducts || 0;

    renderChart(data);
  } catch (error) {
    console.log("Erro dashboard:", error);
    showToast("Erro ao carregar dashboard.", false);
  }
}

function renderChart(data) {
  const ctx = document.getElementById("salesChart");

  if (!ctx) return;

  if (salesChart) {
    salesChart.destroy();
  }

  salesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Pedidos", "Produtos", "Estoque baixo"],
      datasets: [
        {
          label: "Métricas",
          data: [
            data.totalOrders || 0,
            data.totalProducts || 0,
            data.lowStockProducts || 0
          ]
        }
      ]
    }
  });
}

async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    console.log("Produtos recebidos:", products);

    productsGrid.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {
      productsGrid.innerHTML = `
        <p class="empty-orders">Nenhum produto cadastrado.</p>
      `;
      return;
    }

    products.forEach(product => {
      const card = document.createElement("article");
      card.classList.add("product-card");

      const imageUrl = product.image
        ? `http://localhost:3000/uploads/${product.image}`
        : "";

      card.innerHTML = `
        <div>
          ${
            imageUrl
              ? `
                <img
                  src="${imageUrl}"
                  alt="${product.name || "Produto"}"
                  onerror="this.style.display='none'"
                />
              `
              : ""
          }

          <h3>${product.icon || ""} ${product.name || "Produto sem nome"}</h3>
          <p>${product.description || "Sem descrição"}</p>
          <p>Categoria: ${product.category || "Sem categoria"}</p>
          <p>Estoque: ${product.stock ?? 0}</p>

          <strong>R$ ${formatCurrency(product.price)}</strong>
        </div>

        <div class="actions">
          <button
            class="edit"
            onclick='editProduct(${JSON.stringify(product)})'
          >
            Editar
          </button>

          <button
            class="delete"
            onclick="deleteProduct(${product.id})"
          >
            Excluir
          </button>
        </div>
      `;

      productsGrid.appendChild(card);
    });
  } catch (error) {
    console.log("Erro ao carregar produtos:", error);
    showToast("Erro ao carregar produtos.", false);
  }
}

searchProducts.addEventListener("input", event => {
  const value = event.target.value.toLowerCase();

  document.querySelectorAll(".product-card").forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(value) ? "flex" : "none";
  });
});

productForm.addEventListener("submit", async event => {
  event.preventDefault();

  const formData = new FormData();

  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("stock", document.getElementById("stock").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("icon", document.getElementById("icon").value);
  formData.append("description", document.getElementById("description").value);

  const image = imageInput.files[0];

  if (image) {
    formData.append("image", image);
  }

  const url = editingProductId
    ? `${API_URL}/${editingProductId}`
    : API_URL;

  const method = editingProductId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Erro ao salvar produto.", false);
      return;
    }

    showToast(editingProductId ? "Produto atualizado!" : "Produto criado!");

    editingProductId = null;
    submitButton.textContent = "Salvar produto";
    formTitle.textContent = "Cadastrar produto";
    productForm.reset();

    previewImage.src = "";
    previewImage.style.display = "none";

    await loadProducts();
    await loadDashboard();
  } catch (error) {
    console.log("Erro ao salvar produto:", error);
    showToast("Erro ao salvar produto.", false);
  }
});

function editProduct(product) {
  editingProductId = product.id;

  document.getElementById("name").value = product.name || "";
  document.getElementById("price").value = product.price || "";
  document.getElementById("stock").value = product.stock || "";
  document.getElementById("category").value = product.category || "";
  document.getElementById("icon").value = product.icon || "";
  document.getElementById("description").value = product.description || "";

  submitButton.textContent = "Atualizar produto";
  formTitle.textContent = "Editar produto";

  if (product.image) {
    previewImage.src = `http://localhost:3000/uploads/${product.image}`;
    previewImage.style.display = "block";
  } else {
    previewImage.src = "";
    previewImage.style.display = "none";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function deleteProduct(id) {
  const confirmDelete = confirm("Deseja excluir este produto?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Erro ao excluir produto.", false);
      return;
    }

    showToast("Produto excluído!");

    await loadProducts();
    await loadDashboard();
  } catch (error) {
    console.log("Erro ao excluir produto:", error);
    showToast("Erro ao excluir produto.", false);
  }
}

async function loadOrders() {
  try {
    const response = await fetch(ORDERS_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    allOrders = await response.json();

    renderOrders(allOrders);
  } catch (error) {
    console.log("Erro ao carregar pedidos:", error);
    showToast("Erro ao carregar pedidos.", false);
  }
}

function renderOrders(orders) {
  ordersList.innerHTML = "";

  if (!Array.isArray(orders) || orders.length === 0) {
    ordersList.innerHTML = `
      <p class="empty-orders">Nenhum pedido encontrado.</p>
    `;
    return;
  }

  orders.forEach(order => {
    const card = document.createElement("article");
    card.classList.add("order-card");

    card.innerHTML = `
      <div>
        <h3>Pedido #${order.id}</h3>

        <p>Status: <strong>${getStatusLabel(order.status)}</strong></p>
        <p>Total: R$ ${formatCurrency(order.total)}</p>

        ${
          order.customer
            ? `
              <p>Cliente: ${order.customer.name || ""}</p>
              <p>Telefone: ${order.customer.phone || ""}</p>
              <p>Endereço: ${order.customer.address || ""}</p>
            `
            : ""
        }

        <ul>
          ${(order.items || []).map(item => `
            <li>
              ${item.quantity}x ${item.product_name}
              - R$ ${formatCurrency(item.price)}
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="order-actions">
        <select
          class="status-select"
          onchange="updateOrderStatus(${order.id}, this.value)"
        >
          <option value="pending" ${order.status === "pending" ? "selected" : ""}>Recebido</option>
          <option value="paid" ${order.status === "paid" ? "selected" : ""}>Pago</option>
          <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Enviado</option>
          <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Entregue</option>
          <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Cancelado</option>
        </select>

        <button
          class="delete"
          onclick="deleteOrder(${order.id})"
        >
          Excluir pedido
        </button>
      </div>
    `;

    ordersList.appendChild(card);
  });
}

statusFilter.addEventListener("change", event => {
  const status = event.target.value;

  if (status === "all") {
    renderOrders(allOrders);
    return;
  }

  const filteredOrders = allOrders.filter(order => order.status === status);
  renderOrders(filteredOrders);
});

async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Erro ao atualizar status.", false);
      return;
    }

    showToast("Status atualizado!");

    await loadOrders();
    await loadDashboard();
  } catch (error) {
    console.log("Erro ao atualizar status:", error);
    showToast("Erro ao atualizar status.", false);
  }
}

async function deleteOrder(id) {
  const confirmDelete = confirm("Deseja excluir este pedido?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:3000/admin/orders/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Erro ao excluir pedido.", false);
      return;
    }

    showToast("Pedido excluído!");

    await loadOrders();
    await loadDashboard();
  } catch (error) {
    console.log("Erro ao excluir pedido:", error);
    showToast("Erro ao excluir pedido.", false);
  }
}

loadDashboard();
loadProducts();
loadOrders();