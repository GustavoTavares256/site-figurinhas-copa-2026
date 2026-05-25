const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Faça login primeiro.");
  window.location.href = "login.html";
}

const API_URL = "http://localhost:3000/products";

const productForm = document.getElementById("productForm");
const productsList = document.getElementById("productsList");
const submitButton = document.getElementById("submitButton");

const productIdInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const iconInput = document.getElementById("icon");
const stockInput = document.getElementById("stock");
const imageInput = document.getElementById("image");

async function loadProducts() {

  const response = await fetch(API_URL);

  const products = await response.json();

  productsList.innerHTML = "";

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
          ${product.icon} ${product.name}
        </h3>

        <p>
          ${product.description}
        </p>

        <p>
          Preço:
          R$ ${Number(product.price).toFixed(2)}
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

    const formData = new FormData();

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

  const confirmDelete = confirm(
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

}

loadProducts();