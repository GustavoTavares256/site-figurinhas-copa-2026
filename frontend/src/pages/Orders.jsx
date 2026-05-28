import { useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import StoreLayout from "../layouts/StoreLayout";
import { formatCurrency } from "../services/api";
import { listCustomerOrders } from "../services/orderService";

const statusLabels = {
  pending: "Pedido recebido",
  paid: "Pagamento aprovado",
  shipped: "Pedido enviado",
  delivered: "Pedido entregue",
  cancelled: "Pedido cancelado"
};

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function formatDate(date) {
  if (!date) return "Data nao disponivel";
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function Orders() {
  const [phone, setPhone] = useState(localStorage.getItem("lastOrderPhone") || "");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalized = normalizePhone(phone);
    if (normalized.length < 8) return;

    setLoading(true);
    setSearched(true);
    localStorage.setItem("lastOrderPhone", normalized);

    try {
      setOrders(await listCustomerOrders(normalized));
    } finally {
      setLoading(false);
    }
  }

  return (
    <StoreLayout>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-12 lg:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-premium">
          <span className="text-xs font-black uppercase tracking-widest text-emerald">Acompanhamento</span>
          <h1 className="mt-3 text-4xl font-black text-white">Acompanhe seu pedido</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Digite o mesmo telefone usado no checkout para visualizar status, itens e historico.
          </p>
          <form onSubmit={handleSubmit} className="mt-7 grid gap-3 md:grid-cols-[1fr_180px]">
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefone / WhatsApp" required />
            <Button type="submit" disabled={loading}>{loading ? "Buscando..." : "Buscar"}</Button>
          </form>
        </section>

        <section className="mt-8 grid gap-5">
          {!searched && <EmptyState title="Nenhum pedido buscado ainda" />}
          {searched && !loading && orders.length === 0 && (
            <EmptyState title="Nenhum pedido encontrado" description="Confira o telefone informado." />
          )}
          {orders.map((order) => (
            <article key={order.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Pedido #{order.id}</h2>
                  <p className="text-sm text-slate-400">Criado em {formatDate(order.created_at)}</p>
                </div>
                <span className="rounded-full bg-gold px-4 py-2 text-xs font-black text-ink">
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
                <p><strong>Cliente:</strong> {order.customer?.name}</p>
                <p><strong>Telefone:</strong> {order.customer?.phone}</p>
                <p><strong>Endereco:</strong> {order.customer?.address}</p>
              </div>
              <ul className="mt-5 space-y-3">
                {(order.items || []).map((item) => (
                  <li key={item.id || item.product_name} className="flex justify-between rounded-2xl bg-white/5 p-4 text-sm">
                    <span>{item.quantity}x {item.product_name}</span>
                    <strong className="text-gold">R$ {formatCurrency(item.line_total || item.price * item.quantity)}</strong>
                  </li>
                ))}
              </ul>
              <div className="mt-5 text-right text-xl font-black text-white">
                Total: R$ {formatCurrency(order.total)}
              </div>
            </article>
          ))}
        </section>
      </main>
    </StoreLayout>
  );
}
