import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink/70 px-5 py-8 backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <strong className="text-white">Copa Stickers 2026</strong>
          <p className="mt-1">Ecommerce premium para colecionadores de futebol.</p>
        </div>
        <nav className="flex gap-4 font-bold">
          <Link to="/orders" className="hover:text-gold">Pedidos</Link>
          <Link to="/login" className="hover:text-gold">Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
