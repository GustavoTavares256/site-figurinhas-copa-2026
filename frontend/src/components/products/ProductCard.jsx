import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency, getImageUrl } from "../../services/api";
import Button from "../ui/Button";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product }) {
  const { addToCart, favorites, toggleFavorite } = useCart();
  const { showToast } = useToast();
  const outOfStock = Number(product.stock || 0) <= 0;
  const isFavorite = favorites.includes(Number(product.id));
  const isSpecial = ["premium", "raras"].includes(String(product.category).toLowerCase());
  const imageUrl = getImageUrl(product.image);

  function handleAdd() {
    const result = addToCart(product);
    showToast(result.message, result.ok ? "success" : "error");
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden rounded-[1.8rem] border bg-white/[0.06] p-5 shadow-premium backdrop-blur-xl transition ${
        isSpecial ? "border-gold/30" : "border-white/10"
      }`}
    >
      {isSpecial && (
        <span className="absolute left-5 top-5 z-10 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase text-ink">
          {product.category === "premium" ? "Premium" : "Raro"}
        </span>
      )}
      <button
        onClick={() => toggleFavorite(product.id)}
        className={`absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 backdrop-blur-xl transition ${
          isFavorite ? "bg-red-500 text-white" : "bg-ink/60 text-white"
        }`}
      >
        <FiHeart />
      </button>

      <Link to={`/products/${product.id}`} className="block">
        <div className="mb-5 h-60 overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-electric/15 to-emerald/10">
          <ProductVisual product={product} imageUrl={imageUrl} className="transition duration-500 group-hover:scale-105" />
        </div>
      </Link>

      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full border border-electric/30 bg-electric/15 px-3 py-1 text-xs font-black uppercase text-electric">
          {product.category || "produto"}
        </span>
        <span className={`text-xs font-black ${outOfStock ? "text-red-300" : "text-emerald"}`}>
          {outOfStock ? "Sem estoque" : `${product.stock} em estoque`}
        </span>
      </div>

      <Link to={`/products/${product.id}`}>
        <h3 className="min-h-[3.25rem] text-xl font-black text-white transition group-hover:text-gold">
          {product.name}
        </h3>
      </Link>
      <p className="mt-3 min-h-[4.5rem] text-sm leading-7 text-slate-400">
        {product.description || "Produto de colecao Copa Stickers 2026."}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <strong className="text-2xl font-black text-gold">
          R$ {formatCurrency(product.price)}
        </strong>
        <Button onClick={handleAdd} disabled={outOfStock} className="px-4">
          <FiShoppingCart />
          Comprar
        </Button>
      </div>
    </motion.article>
  );
}
