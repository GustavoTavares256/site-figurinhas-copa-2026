const ORDERS_URL = "http://localhost:3000/admin/orders";
const ordersList = document.getElementById("ordersList");

const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Faça login primeiro.");
  window.location.href = "login.html";
}

const API_URL = "http://localhost:3000/products";

const DASHBOARD_URL =
  "http://localhost:3000/dashboard";

const productForm =
  document.getElementById("productForm");

const productsList =
  document.getElementById("productsList");

const submitButton =
  document.getElementById("submitButton");

const productIdInput =
  document.getElementById("productId");

const nameInput =
  document.getElementById("name");

const descriptionInput =
  document.getElementById("description");

const priceInput =
  document.getElementById("price");

const categoryInput =
  document.getElementById("category");

const iconInput =
  document.getElementById("icon");

const stockInput =
  document.getElementById("stock");

const imageInput =
  document.getElementById("image");

async function loadDashboard() {

  try {

    const response = await fetch(
      DASHBOARD_URL,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data =
      await response.json();

    document.getElementById(
      "totalOrders"
    ).textContent =
      data.totalOrders;

    document.getElementById(
      "totalRevenue"
    ).textContent =
      `R$ ${Number(
        data.totalRevenue
      ).toFixed(2)}`;

    document.getElementById(
      "totalProducts"
    ).textContent =
      data.totalProducts;

    document.getElementById(
      "lowStockProducts"
    ).textContent =
      data.lowStockProducts;

  } catch (error) {

    console.log(error);

  }

}

async function loadProducts() {

  const response =
    await fetch(API_URL);

  const products =
    await response.json();

  productsList.innerHTML = "";

  products.forEach(product => {

    const card =
      document.createElement("article");

    card.classList.add(
      "product-card"
    );

    const imageUrl =
      product.image
        ? `http://localhost:3000/uploads/${product.image}`
        : "";

    card.innerHTML = `
      <div>

        ${
          imageUrl
            ? `
              <img
                src="${imageUrl}"
                alt="${product.name}"
                width="120"
                style="
                  border-radius: 12px;
                  margin-bottom: 12px;
                  object-fit: cover;
                "
              >
            `
            : ""
        }

        <h3>
          ${product.icon}
          ${product.name}
        </h3>

        <p>
          ${product.description}
        </p>

        <p>
          Preço:
          R$ ${Number(
            product.price
          ).toFixed(2)}
        </p>

        <p>
          Categoria:
          ${product.category}
        </p>

        <p>
          Estoque:
          ${product.stock}
        </p>

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
          Deletar
        </button>

      </div>
    `;

    productsList.appendChild(card);

  });

}

productForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const formData =
      new FormData();

    formData.append(
      "name",
      nameInput.value
    );

    formData.append(
      "description",
      descriptionInput.value
    );

    formData.append(
      "price",
      priceInput.value
    );

    formData.append(
      "category",
      categoryInput.value
    );

    formData.append(
      "icon",
      iconInput.value
    );

    formData.append(
      "stock",
      stockInput.value
    );

    if (
      imageInput.files &&
      imageInput.files[0]
    ) {

      formData.append(
        "image",
        imageInput.files[0]
      );

    }

    const productId =
      productIdInput.value;

    if (productId) {

      await fetch(
        `${API_URL}/${productId}`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );

      alert(
        "Produto atualizado com sucesso!"
      );

    } else {

      await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );

      alert(
        "Produto cadastrado com sucesso!"
      );

    }

    productForm.reset();

    productIdInput.value = "";

    submitButton.textContent =
      "Cadastrar produto";

    loadProducts();

    loadDashboard();

  }
);

function editProduct(product) {

  productIdInput.value =
    product.id;

  nameInput.value =
    product.name;

  descriptionInput.value =
    product.description;

  priceInput.value =
    product.price;

  categoryInput.value =
    product.category;

  iconInput.value =
    product.icon;

  stockInput.value =
    product.stock;

  submitButton.textContent =
    "Atualizar produto";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

async function deleteProduct(id) {

  const confirmDelete =
    confirm(
      "Tem certeza que deseja deletar este produto?"
    );

  if (!confirmDelete) return;

  await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  alert(
    "Produto deletado com sucesso!"
  );

  loadProducts();

  loadDashboard();

}

function logout() {

  localStorage.removeItem(
    "adminToken"
  );

  localStorage.removeItem(
    "adminName"
  );

  window.location.href =
    "login.html";

}

async function loadOrders() {
  const response = await fetch(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const orders = await response.json();

  ordersList.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("article");
    card.classList.add("order-card");

    card.innerHTML = `
      <h3>Pedido #${order.id}</h3>
      <p>Status: ${order.status}</p>
      <p>Total: R$ ${Number(order.total).toFixed(2)}</p>

      <ul>
        ${order.items.map(item => `
          <li>
            ${item.quantity}x ${item.product_name} - R$ ${Number(item.price).toFixed(2)}
          </li>
        `).join("")}
      </ul>
    `;

    ordersList.appendChild(card);
  });
}

loadOrders();

loadDashboard();

loadProducts();