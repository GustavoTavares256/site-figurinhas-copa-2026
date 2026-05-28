import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readJson("cart", []));
  const [favorites, setFavorites] = useState(() => readJson("favorites", []));
  const [coupon, setCoupon] = useState(() => localStorage.getItem("checkoutCoupon") || "");
  const [isCartOpen, setIsCartOpen] = useState(false);

  function persistCart(nextItems) {
    setItems(nextItems);
    localStorage.setItem("cart", JSON.stringify(nextItems));
  }

  function addToCart(product) {
    const stock = Number(product.stock || 0);
    const current = items.find((item) => Number(item.id) === Number(product.id));

    if (stock <= 0) return { ok: false, message: "Produto sem estoque." };
    if (current && current.quantity + 1 > stock) {
      return { ok: false, message: "Limite de estoque atingido." };
    }

    const nextItems = current
      ? items.map((item) =>
          Number(item.id) === Number(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...items, { ...product, quantity: 1 }];

    persistCart(nextItems);
    setIsCartOpen(true);
    return { ok: true, message: "Produto adicionado." };
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    persistCart(
      items.map((item) =>
        Number(item.id) === Number(id)
          ? { ...item, quantity: Math.min(quantity, Number(item.stock || quantity)) }
          : item
      )
    );
  }

  function removeFromCart(id) {
    persistCart(items.filter((item) => Number(item.id) !== Number(id)));
  }

  function clearCart() {
    persistCart([]);
    localStorage.removeItem("checkoutCart");
    localStorage.removeItem("checkoutCoupon");
    setCoupon("");
  }

  function toggleFavorite(id) {
    const numericId = Number(id);
    const nextFavorites = favorites.includes(numericId)
      ? favorites.filter((item) => item !== numericId)
      : [...favorites, numericId];

    setFavorites(nextFavorites);
    localStorage.setItem("favorites", JSON.stringify(nextFavorites));
  }

  function applyCoupon(code) {
    const normalized = String(code || "").trim().toUpperCase();
    if (normalized === "COPA10") {
      setCoupon(normalized);
      localStorage.setItem("checkoutCoupon", normalized);
      return true;
    }

    setCoupon("");
    localStorage.removeItem("checkoutCoupon");
    return false;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const discount = coupon === "COPA10" ? subtotal * 0.1 : 0;
  const total = Math.max(subtotal - discount, 0);
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  const value = useMemo(
    () => ({
      items,
      favorites,
      coupon,
      subtotal,
      discount,
      total,
      totalItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      applyCoupon
    }),
    [items, favorites, coupon, subtotal, discount, total, totalItems, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
