let products = [];

const productsGrid = document.getElementById("productsGrid");
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const filterButtons = document.querySelectorAll(".filter");

let cartList = [];

function formatCurrency(value) {
  return Number(value || 0).toFixed(2).replace(".", ",");
}

function renderProducts(category = "all") {
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(product => product.category === category);

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <p class="empty-products">
        Nenhum produto encontrado.
      </p>
    `;
    return;
  }

  filteredProducts.forEach(product => {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");

    const imageUrl = product.image
      ? `http://localhost:3000/uploads/${product.image}`
      : null;

    productCard.innerHTML = `
      <div class="product-image">
        ${
          imageUrl
            ? `
              <img
                src="${imageUrl}"
                alt="${product.name || "Produto"}"
                class="product-img"
                onerror="this.style.display='none'"
              />
            `
            : product.icon || "📦"
        }
      </div>

      <h3>${product.name || "Produto sem nome"}</h3>

      <p>${product.description || "Sem descrição disponível."}</p>

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

    productsGrid.appendChild(productCard);
  });
}

function addToCart(productId) {
  const product = products.find(item => Number(item.id) === Number(productId));

  if (!product) return;

  const existingProduct = cartList.find(
    item => Number(item.id) === Number(productId)
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

function increaseQuantity(productId) {
  const product = cartList.find(item => Number(item.id) === Number(productId));

  if (!product) return;

  product.quantity += 1;

  updateCart();
}

function decreaseQuantity(productId) {
  const product = cartList.find(item => Number(item.id) === Number(productId));

  if (!product) return;

  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    removeFromCart(productId);
  }

  updateCart();
}

function removeFromCart(productId) {
  cartList = cartList.filter(
    item => Number(item.id) !== Number(productId)
  );

  updateCart();
}

function updateCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  if (cartList.length === 0) {
    cartItems.innerHTML = `
      <p>Seu carrinho está vazio.</p>
    `;
  }

  cartList.forEach(item => {
    total += Number(item.price || 0) * item.quantity;
    totalItems += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <h4>${item.name}</h4>

      <div class="quantity-control">
        <button onclick="decreaseQuantity(${item.id})">
          -
        </button>

        <span>${item.quantity}</span>

        <button onclick="increaseQuantity(${item.id})">
          +
        </button>
      </div>

      <span>
        R$ ${formatCurrency(Number(item.price || 0) * item.quantity)}
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

  if (cartTotal) {
    cartTotal.textContent = formatCurrency(total);
  }

  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

function openCartMenu() {
  if (!cart || !overlay) return;

  cart.classList.add("active");
  overlay.classList.add("active");
}

function closeCartMenu() {
  if (!cart || !overlay) return;

  cart.classList.remove("active");
  overlay.classList.remove("active");
}

function goToCheckout() {
  if (cartList.length === 0) {
    alert("Carrinho vazio.");
    return;
  }

  localStorage.setItem(
    "checkoutCart",
    JSON.stringify(cartList)
  );

  window.location.href = "checkout.html";
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.dataset.filter;

    renderProducts(category);
  });
});

async function loadProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");

    const data = await response.json();

    console.log("Produtos loja:", data);

    products = Array.isArray(data) ? data : [];

    renderProducts();

  } catch (error) {
    console.log("Erro ao carregar produtos:", error);

    if (productsGrid) {
      productsGrid.innerHTML = `
        <p class="empty-products">
          Erro ao carregar produtos. Verifique se o backend está rodando.
        </p>
      `;
    }
  }
}

if (openCart) {
  openCart.addEventListener("click", openCartMenu);
}

if (closeCart) {
  closeCart.addEventListener("click", closeCartMenu);
}

if (overlay) {
  overlay.addEventListener("click", closeCartMenu);
}

loadProducts();
updateCart();