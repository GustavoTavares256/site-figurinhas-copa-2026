let products = [];
let filteredProducts = [];
let cartList = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentFilter = "all";
let currentPage = 1;
let currentCoupon = localStorage.getItem("checkoutCoupon") || null;

const ITEMS_PER_PAGE = 6;
const productsGrid = document.getElementById("productsGrid");
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");
const toast = document.getElementById("toast");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const couponInput = document.getElementById("couponInput");
const applyCoupon = document.getElementById("applyCoupon");

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 2800);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartList));
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  document.body.classList.toggle("light", savedTheme === "light");
  themeToggle.textContent = savedTheme === "light" ? "Sol" : "Lua";
}

function goToProducts() {
  document.getElementById("store").scrollIntoView({ behavior: "smooth" });
}

function goToFavorites() {
  filteredProducts = products.filter((product) => favorites.includes(Number(product.id)));
  currentPage = 1;
  renderProducts();
  goToProducts();
}

function showSkeleton() {
  productsGrid.innerHTML = "";

  for (let i = 0; i < 6; i += 1) {
    productsGrid.innerHTML += `
      <article class="product-card skeleton-card">
        <div class="skeleton image"></div>
        <div class="skeleton title"></div>
        <div class="skeleton text"></div>
        <div class="skeleton button"></div>
      </article>
    `;
  }
}

async function loadProducts() {
  showSkeleton();

  try {
    products = await apiFetch("/products");
    applyFilters();
  } catch (error) {
    productsGrid.innerHTML = `
      <p class="empty-products">
        ${error.message || "Erro ao carregar produtos."}
      </p>
    `;
  }
}

function applyFilters() {
  const search = searchInput.value.toLowerCase().trim();
  const sort = sortSelect.value;

  filteredProducts = products.filter((product) => {
    const category = String(product.category || "").toLowerCase();
    const matchesCategory = currentFilter === "all" || category === currentFilter;
    const searchText = `${product.name || ""} ${product.description || ""} ${product.category || ""}`.toLowerCase();
    return matchesCategory && searchText.includes(search);
  });

  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "price-desc") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sort === "name") {
    filteredProducts.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  currentPage = 1;
  renderProducts();
}

function renderProducts() {
  productsGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<p class="empty-products">Nenhum produto encontrado.</p>';
    pageInfo.textContent = "Pagina 1";
    return;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageProducts = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

  pageProducts.forEach((product) => {
    const imageUrl = getImageUrl(product.image);
    const isFavorite = favorites.includes(Number(product.id));
    const outOfStock = Number(product.stock || 0) <= 0;
    const isSpecial = ["premium", "raras"].includes(String(product.category).toLowerCase());
    const card = document.createElement("article");

    card.classList.add("product-card");
    if (isSpecial) card.classList.add("special-card");
    card.innerHTML = `
      <button class="favorite-btn ${isFavorite ? "active" : ""}" onclick="toggleFavorite(${product.id})">
        ${isFavorite ? "♥" : "♡"}
      </button>
      ${isSpecial ? `<span class="special-badge">${product.category === "premium" ? "Premium" : "Raro"}</span>` : ""}
      <div class="product-image">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="${product.name}" class="product-img" />`
            : `<span class="emoji-product">${product.icon || "PACK"}</span>`
        }
      </div>
      <span class="category-pill">${product.category || "produto"}</span>
      <h3>${product.name}</h3>
      <p>${product.description || "Sem descricao"}</p>
      <div class="stock-row ${outOfStock ? "danger" : ""}">
        ${outOfStock ? "Sem estoque" : `${product.stock} em estoque`}
      </div>
      <div class="product-footer">
        <span class="price">R$ ${formatCurrency(product.price)}</span>
        <button class="add-cart" onclick="addToCart(${product.id})" ${outOfStock ? "disabled" : ""}>
          ${outOfStock ? "Indisponivel" : "Comprar"}
        </button>
      </div>
    `;

    productsGrid.appendChild(card);
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  pageInfo.textContent = `Pagina ${currentPage} de ${totalPages}`;
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
}

function toggleFavorite(productId) {
  const id = Number(productId);

  if (favorites.includes(id)) {
    favorites = favorites.filter((item) => item !== id);
    showToast("Removido dos favoritos.", "error");
  } else {
    favorites.push(id);
    showToast("Adicionado aos favoritos.");
  }

  saveFavorites();
  renderProducts();
}

function addToCart(productId) {
  const product = products.find((item) => Number(item.id) === Number(productId));

  if (!product || Number(product.stock || 0) <= 0) return;

  const existingProduct = cartList.find((item) => Number(item.id) === Number(productId));
  const currentQuantity = existingProduct ? existingProduct.quantity : 0;

  if (currentQuantity + 1 > Number(product.stock)) {
    showToast("Quantidade maior que o estoque.", "error");
    return;
  }

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cartList.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCart();
  openCartMenu();
  showToast("Produto adicionado.");
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  if (cartList.length === 0) {
    cartItems.innerHTML = "<p>Seu carrinho esta vazio.</p>";
  }

  cartList.forEach((item) => {
    total += Number(item.price) * item.quantity;
    totalItems += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <h4>${item.name}</h4>
      <div class="quantity-control">
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${item.id})">+</button>
      </div>
      <span>R$ ${formatCurrency(item.price * item.quantity)}</span>
      <button class="remove-item" onclick="removeFromCart(${item.id})">Remover</button>
    `;
    cartItems.appendChild(cartItem);
  });

  if (currentCoupon === "COPA10") total *= 0.9;

  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = totalItems;
}

function increaseQuantity(productId) {
  const product = cartList.find((item) => Number(item.id) === Number(productId));
  if (!product) return;

  if (product.quantity + 1 > Number(product.stock || 0)) {
    showToast("Limite de estoque atingido.", "error");
    return;
  }

  product.quantity += 1;
  saveCart();
  updateCart();
}

function decreaseQuantity(productId) {
  const product = cartList.find((item) => Number(item.id) === Number(productId));
  if (!product) return;

  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCart();
}

function removeFromCart(productId) {
  cartList = cartList.filter((item) => Number(item.id) !== Number(productId));
  saveCart();
  updateCart();
  showToast("Produto removido.", "error");
}

function openCartMenu() {
  cart.classList.add("active");
  overlay.classList.add("active");
}

function closeCartMenu() {
  cart.classList.remove("active");
  overlay.classList.remove("active");
}

function goToCheckout() {
  if (cartList.length === 0) {
    showToast("Carrinho vazio.", "error");
    return;
  }

  localStorage.setItem("checkoutCart", JSON.stringify(cartList));
  if (currentCoupon) localStorage.setItem("checkoutCoupon", currentCoupon);
  window.location.href = "checkout.html";
}

applyCoupon.addEventListener("click", () => {
  const coupon = couponInput.value.trim().toUpperCase();

  if (coupon === "COPA10") {
    currentCoupon = "COPA10";
    localStorage.setItem("checkoutCoupon", currentCoupon);
    showToast("Cupom aplicado.");
    updateCart();
    return;
  }

  currentCoupon = null;
  localStorage.removeItem("checkoutCoupon");
  showToast("Cupom invalido.", "error");
});

prevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderProducts();
    goToProducts();
  }
});

nextPage.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  if (currentPage < totalPages) {
    currentPage += 1;
    renderProducts();
    goToProducts();
  }
});

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    applyFilters();
    goToProducts();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "Sol" : "Lua";
});

openCart.addEventListener("click", openCartMenu);
closeCart.addEventListener("click", closeCartMenu);
overlay.addEventListener("click", closeCartMenu);

window.goToProducts = goToProducts;
window.goToFavorites = goToFavorites;
window.toggleFavorite = toggleFavorite;
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;
window.goToCheckout = goToCheckout;

initTheme();
loadProducts();
updateCart();
