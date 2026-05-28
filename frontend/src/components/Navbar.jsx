import { Link, NavLink } from "react-router-dom";
import { FiMoon, FiShoppingBag, FiSun } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import Button from "./ui/Button";

const navItems = [
  ["Todos", "all"],
  ["Albuns", "albuns"],
  ["Envelopes", "envelopes"],
  ["Boxes", "boxes"],
  ["Combos", "combos"],
  ["Premium", "premium"]
];

export default function Navbar({ activeCategory, onCategoryChange }) {
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 px-5 py-4 backdrop-blur-2xl lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="flex items-center gap-3 text-xl font-black text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-electric to-emerald text-ink">
            CS
          </span>
          Copa Stickers
        </Link>

        {onCategoryChange && (
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:justify-center lg:pb-0">
            {navItems.map(([label, value]) => (
              <button
                key={value}
                onClick={() => onCategoryChange(value)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black transition ${
                  activeCategory === value
                    ? "border-transparent bg-gold text-ink"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <NavLink
            to="/orders"
            className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            Meus pedidos
          </NavLink>
          <NavLink
            to="/login"
            className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            Admin
          </NavLink>
          <button
            onClick={toggleTheme}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <Button onClick={() => setIsCartOpen(true)} className="px-4">
            <FiShoppingBag />
            {totalItems}
          </Button>
        </div>
      </div>
    </header>
  );
}
