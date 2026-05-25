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
const checkoutButton = document.querySelector(".checkout-btn");

let cartList = [];

function formatCurrency(value) {
  return Number(value).toFixed(2).replace(".", ",");
}

function renderProducts(category = "all") {

  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(
          product => product.category === category
        );

  filteredProducts.forEach(product => {

    const productCard =
      document.createElement("article");

    productCard.classList.add(
      "product-card"
    );

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
                alt="${product.name}"
                class="product-img"
              >
            `
            : product.icon || "📦"
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

    productsGrid.appendChild(productCard);

  });

}

function addToCart(productId) {

  const product =
    products.find(
      item => item.id === productId
    );

  if (!product) return;

  const existingProduct =
    cartList.find(
      item => item.id === productId
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

  const product =
    cartList.find(
      item => item.id === productId
    );

  if (!product) return;

  product.quantity += 1;

  updateCart();

}

function decreaseQuantity(productId) {

  const product =
    cartList.find(
      item => item.id === productId
    );

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
    item => item.id !== productId
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

    total +=
      Number(item.price) * item.quantity;

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
        R$ ${formatCurrency(
          Number(item.price) * item.quantity
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

  if (cartTotal) {
    cartTotal.textContent =
      formatCurrency(total);
  }

  if (cartCount) {
    cartCount.textContent =
      totalItems;
  }

}

async function checkout() {

  if (cartList.length === 0) {

    alert("Carrinho vazio.");

    return;

  }

  try {

    const response = await fetch(
      "http://localhost:3000/checkout",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          items: cartList
        })
      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      alert(
        data.message ||
        "Erro ao finalizar pedido."
      );

      return;

    }

    alert(
      "Pedido salvo com sucesso!"
    );

    cartList = [];

    updateCart();

    closeCartMenu();

  } catch (error) {

    console.log(
      "Erro no checkout:",
      error
    );

    alert(
      "Erro ao conectar com o servidor."
    );

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

filterButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const category =
        button.dataset.filter;

      renderProducts(category);

    }
  );

});

async function loadProducts() {

  try {

    const response =
      await fetch(
        "http://localhost:3000/products"
      );

    products =
      await response.json();

    console.log(products);

    renderProducts();

  } catch (error) {

    console.log(
      "Erro ao carregar produtos:",
      error
    );

  }

}

if (openCart) {
  openCart.addEventListener(
    "click",
    openCartMenu
  );
}

if (closeCart) {
  closeCart.addEventListener(
    "click",
    closeCartMenu
  );
}

if (overlay) {
  overlay.addEventListener(
    "click",
    closeCartMenu
  );
}

if (checkoutButton) {
  checkoutButton.addEventListener(
    "click",
    checkout
  );
}

loadProducts();

updateCart();