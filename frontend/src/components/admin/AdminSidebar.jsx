import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBox, FiLogOut, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const links = [
    ["Dashboard", "#dashboard", <FiBarChart2 />],
    ["Produtos", "#products", <FiBox />],
    ["Pedidos", "#orders", <FiShoppingBag />]
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-ink/95 p-6 lg:block">
      <div className="mb-10 text-2xl font-black text-white">Copa Admin</div>
      <nav className="grid gap-2">
        {links.map(([label, href, icon]) => (
          <a key={label} href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-slate-300 hover:bg-white/10 hover:text-white">
            {icon}
            {label}
          </a>
        ))}
        <NavLink to="/" className="rounded-2xl px-4 py-3 font-bold text-slate-300 hover:bg-white/10">
          Ver loja
        </NavLink>
      </nav>
      <button
        onClick={logout}
        className="mt-10 flex w-full items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 font-black text-white"
      >
        <FiLogOut /> Sair
      </button>
    </aside>
  );
}
