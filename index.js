let products = [];

let cartList = [];

/* ELEMENTOS */

const productsGrid =
  document.getElementById("productsGrid");

const cart =
  document.getElementById("cart");

const overlay =
  document.getElementById("overlay");

const openCart =
  document.getElementById("openCart");

const closeCart =
  document.getElementById("closeCart");

const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const cartCount =
  document.getElementById("cartCount");

const filterButtons =
  document.querySelectorAll(".filter");

/* FORMATAR */

function formatCurrency(value) {

  return Number(value || 0)
    .toFixed(2)
    .replace(".", ",");

}

/* SCROLL */

function goToProducts() {

  document
    .getElementById("productsGrid")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}

/* CARREGAR PRODUTOS */

async function loadProducts() {

  try {

    const response =
      await fetch(
        "http://localhost:3000/products"
      );

    const data =
      await response.json();

    console.log(data);

    products =
      Array.isArray(data)
        ? data
        : [];

    renderProducts();

  } catch (error) {

    console.log(error);

    productsGrid.innerHTML = `
      <p class="empty-products">
        Erro ao carregar produtos.
      </p>
    `;

  }

}

/* RENDERIZAR */

function renderProducts(category = "all") {

  productsGrid.innerHTML = "";

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(product =>
          product.category === category
        );

  if (filteredProducts.length === 0) {

    productsGrid.innerHTML = `
      <p class="empty-products">
        Nenhum produto encontrado.
      </p>
    `;

    return;

  }

  filteredProducts.forEach(product => {

    const card =
      document.createElement("article");

    card.classList.add("product-card");

    const imageUrl =
      product.image
        ? `http://localhost:3000/uploads/${product.image}`
        : null;

    card.innerHTML = `

      <div class="product-image">

        ${
          imageUrl
            ? `
              <img
                src="${imageUrl}"
                alt="${product.name}"
                class="product-img"
              />
            `
            : `
              <span class="emoji-product">
                ${product.icon || "📦"}
              </span>
            `
        }

      </div>

      <h3>
        ${product.name}
      </h3>

      <p>
        ${product.description}
      </p>

      <div class="product-footer">

        <span class="price">
          R$ ${formatCurrency(product.price)}
        </span>

        <button
          class="add-cart"
          onclick="addToCart(${product.id})"
        >
          Comprar
        </button>

      </div>

    `;

    productsGrid.appendChild(card);

  });

}

/* ADICIONAR */

function addToCart(productId) {

  const product =
    products.find(
      item =>
        Number(item.id) ===
        Number(productId)
    );

  if (!product) return;

  const existingProduct =
    cartList.find(
      item =>
        Number(item.id) ===
        Number(productId)
    );

  if (existingProduct) {

    existingProduct.quantity += 1;

  } else {

    cartList.push({
      ...product,
      quantity: 1
    });

  }

  updateCart();

  openCartMenu();

}

/* CARRINHO */

function updateCart() {

  cartItems.innerHTML = "";

  let total = 0;

  let totalItems = 0;

  if (cartList.length === 0) {

    cartItems.innerHTML = `
      <p>
        Seu carrinho está vazio.
      </p>
    `;

  }

  cartList.forEach(item => {

    total +=
      Number(item.price) *
      item.quantity;

    totalItems += item.quantity;

    const cartItem =
      document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `

      <h4>
        ${item.name}
      </h4>

      <div class="quantity-control">

        <button
          onclick="decreaseQuantity(${item.id})"
        >
          -
        </button>

        <span>
          ${item.quantity}
        </span>

        <button
          onclick="increaseQuantity(${item.id})"
        >
          +
        </button>

      </div>

      <span>
        R$
        ${formatCurrency(
          item.price * item.quantity
        )}
      </span>

      <button
        class="remove-item"
        onclick="removeFromCart(${item.id})"
      >
        Remover
      </button>

    `;

    cartItems.appendChild(cartItem);

  });

  cartTotal.textContent =
    formatCurrency(total);

  cartCount.textContent =
    totalItems;

}

/* QUANTIDADE */

function increaseQuantity(productId) {

  const product =
    cartList.find(
      item =>
        Number(item.id) ===
        Number(productId)
    );

  if (!product) return;

  product.quantity += 1;

  updateCart();

}

function decreaseQuantity(productId) {

  const product =
    cartList.find(
      item =>
        Number(item.id) ===
        Number(productId)
    );

  if (!product) return;

  if (product.quantity > 1) {

    product.quantity -= 1;

  } else {

    removeFromCart(productId);

  }

  updateCart();

}

/* REMOVER */

function removeFromCart(productId) {

  cartList =
    cartList.filter(
      item =>
        Number(item.id) !==
        Number(productId)
    );

  updateCart();

}

/* MENU */

function openCartMenu() {

  cart.classList.add("active");

  overlay.classList.add("active");

}

function closeCartMenu() {

  cart.classList.remove("active");

  overlay.classList.remove("active");

}

/* CHECKOUT */

function goToCheckout() {

  if (cartList.length === 0) {

    alert("Carrinho vazio.");

    return;

  }

  localStorage.setItem(
    "checkoutCart",
    JSON.stringify(cartList)
  );

  window.location.href =
    "checkout.html";

}

/* FILTROS */

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts(
      button.dataset.filter
    );

  });

});

/* EVENTOS */

openCart.addEventListener(
  "click",
  openCartMenu
);

closeCart.addEventListener(
  "click",
  closeCartMenu
);

overlay.addEventListener(
  "click",
  closeCartMenu
);

/* INIT */

loadProducts();

updateCart();