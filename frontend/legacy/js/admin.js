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
      background: success ? "#00a878" : "#e5484d",
      borderRadius: "12px",
      fontWeight: "700"
    }
  }).showToast();
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
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminName");
  window.location.href = "login.html";
});

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  previewImage.src = URL.createObjectURL(file);
  previewImage.style.display = "block";
});

async function loadDashboard() {
  try {
    const data = await apiFetch("/dashboard");
    productsCount.textContent = data.totalProducts || 0;
    ordersCount.textContent = data.totalOrders || 0;
    revenueValue.textContent = `R$ ${formatCurrency(data.totalRevenue || 0)}`;
    lowStockCount.textContent = data.lowStockProducts || 0;
    renderChart(data.ordersByStatus || []);
  } catch (error) {
    showToast(error.message || "Erro ao carregar dashboard.", false);
  }
}

function renderChart(statusRows) {
  const ctx = document.getElementById("salesChart");
  if (!ctx) return;
  if (salesChart) salesChart.destroy();

  salesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: statusRows.map((row) => getStatusLabel(row.status)),
      datasets: [
        {
          label: "Pedidos",
          data: statusRows.map((row) => row.total),
          backgroundColor: ["#ffd500", "#00b4ff", "#00a878", "#7c3aed", "#e5484d"]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

async function loadProducts() {
  try {
    const products = await apiFetch("/products");
    productsGrid.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {
      productsGrid.innerHTML = '<p class="empty-orders">Nenhum produto cadastrado.</p>';
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("article");
      const imageUrl = getImageUrl(product.image);
      card.classList.add("product-card");
      card.innerHTML = `
        <div>
          ${imageUrl ? `<img src="${imageUrl}" alt="${product.name || "Produto"}" />` : ""}
          <h3>${product.icon || ""} ${product.name || "Produto sem nome"}</h3>
          <p>${product.description || "Sem descricao"}</p>
          <p>Categoria: ${product.category || "Sem categoria"}</p>
          <p>Estoque: ${product.stock ?? 0}</p>
          <strong>R$ ${formatCurrency(product.price)}</strong>
        </div>
        <div class="actions">
          <button class="edit" onclick='editProduct(${JSON.stringify(product)})'>Editar</button>
          <button class="delete" onclick="deleteProduct(${product.id})">Excluir</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  } catch (error) {
    showToast(error.message || "Erro ao carregar produtos.", false);
  }
}

searchProducts.addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach((card) => {
    card.style.display = card.textContent.toLowerCase().includes(value) ? "flex" : "none";
  });
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("stock", document.getElementById("stock").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("icon", document.getElementById("icon").value);
  formData.append("description", document.getElementById("description").value);

  const image = imageInput.files[0];
  if (image) formData.append("image", image);

  try {
    submitButton.disabled = true;
    submitButton.textContent = editingProductId ? "Atualizando..." : "Salvando...";

    await apiFetch(editingProductId ? `/products/${editingProductId}` : "/products", {
      method: editingProductId ? "PUT" : "POST",
      body: formData
    });

    showToast(editingProductId ? "Produto atualizado." : "Produto criado.");
    editingProductId = null;
    submitButton.textContent = "Salvar produto";
    formTitle.textContent = "Cadastrar produto";
    productForm.reset();
    previewImage.src = "";
    previewImage.style.display = "none";
    await loadProducts();
    await loadDashboard();
  } catch (error) {
    showToast(error.message || "Erro ao salvar produto.", false);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = editingProductId ? "Atualizar produto" : "Salvar produto";
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
    previewImage.src = getImageUrl(product.image);
    previewImage.style.display = "block";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteProduct(id) {
  if (!confirm("Deseja excluir este produto?")) return;

  try {
    await apiFetch(`/products/${id}`, { method: "DELETE" });
    showToast("Produto excluido.");
    await loadProducts();
    await loadDashboard();
  } catch (error) {
    showToast(error.message || "Erro ao excluir produto.", false);
  }
}

async function loadOrders() {
  try {
    allOrders = await apiFetch("/admin/orders");
    renderOrders(allOrders);
  } catch (error) {
    showToast(error.message || "Erro ao carregar pedidos.", false);
  }
}

function renderOrders(orders) {
  ordersList.innerHTML = "";

  if (!Array.isArray(orders) || orders.length === 0) {
    ordersList.innerHTML = '<p class="empty-orders">Nenhum pedido encontrado.</p>';
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("article");
    card.classList.add("order-card");
    card.innerHTML = `
      <div>
        <h3>Pedido #${order.id}</h3>
        <p>Status: <strong>${getStatusLabel(order.status)}</strong></p>
        <p>Total: R$ ${formatCurrency(order.total)}</p>
        <p>Cliente: ${order.customer?.name || ""}</p>
        <p>Telefone: ${order.customer?.phone || ""}</p>
        <p>Endereco: ${order.customer?.address || ""}</p>
        <ul>
          ${(order.items || []).map((item) => `
            <li>${item.quantity}x ${item.product_name} - R$ ${formatCurrency(item.line_total || item.price * item.quantity)}</li>
          `).join("")}
        </ul>
      </div>
      <div class="order-actions">
        <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
          <option value="pending" ${order.status === "pending" ? "selected" : ""}>Recebido</option>
          <option value="paid" ${order.status === "paid" ? "selected" : ""}>Pago</option>
          <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Enviado</option>
          <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Entregue</option>
          <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Cancelado</option>
        </select>
        <button class="delete" onclick="deleteOrder(${order.id})">Excluir pedido</button>
      </div>
    `;
    ordersList.appendChild(card);
  });
}

statusFilter.addEventListener("change", (event) => {
  const status = event.target.value;
  renderOrders(status === "all" ? allOrders : allOrders.filter((order) => order.status === status));
});

async function updateOrderStatus(orderId, status) {
  try {
    await apiFetch(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    showToast("Status atualizado.");
    await loadOrders();
    await loadDashboard();
  } catch (error) {
    showToast(error.message || "Erro ao atualizar status.", false);
  }
}

async function deleteOrder(id) {
  if (!confirm("Deseja excluir este pedido?")) return;

  try {
    await apiFetch(`/admin/orders/${id}`, { method: "DELETE" });
    showToast("Pedido excluido.");
    await loadOrders();
    await loadDashboard();
  } catch (error) {
    showToast(error.message || "Erro ao excluir pedido.", false);
  }
}

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;

loadDashboard();
loadProducts();
loadOrders();
