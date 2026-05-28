import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import StoreLayout from "../layouts/StoreLayout";
import { formatCurrency } from "../services/api";
import { checkoutOrder } from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, coupon, total, discount, clearCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  function updateField(event) {
    setCustomer((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!items.length) {
      showToast("Carrinho vazio.", "error");
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      const data = await checkoutOrder({
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        customer,
        couponCode: coupon || null
      });

      localStorage.setItem("lastOrderId", data.order.id);
      localStorage.setItem("lastOrderPhone", customer.phone.replace(/\D/g, ""));
      clearCart();
      navigate("/success");
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Erro ao criar pedido.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StoreLayout>
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1.3fr_.7fr] lg:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
          <span className="text-xs font-black uppercase tracking-widest text-emerald">Checkout</span>
          <h1 className="mt-2 text-4xl font-black text-white">Finalizar compra</h1>
          <p className="mt-2 text-slate-400">Preencha seus dados para registrar o pedido.</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <Input name="name" placeholder="Nome completo" value={customer.name} onChange={updateField} required />
            <Input name="email" type="email" placeholder="E-mail" value={customer.email} onChange={updateField} required />
            <Input name="phone" placeholder="Telefone / WhatsApp" value={customer.phone} onChange={updateField} required />
            <Input name="address" placeholder="Endereco completo" value={customer.address} onChange={updateField} required />
            <Button type="submit" disabled={loading}>
              {loading ? "Criando pedido..." : "Confirmar pedido"}
            </Button>
          </form>
        </section>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
          <h2 className="text-2xl font-black text-white">Resumo</h2>
          <div className="mt-6 space-y-4">
            {items.length === 0 && <p className="text-slate-400">Seu carrinho esta vazio.</p>}
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/5 p-4">
                <h3 className="font-black text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {item.quantity}x R$ {formatCurrency(item.price)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Desconto</span>
              <strong>R$ {formatCurrency(discount)}</strong>
            </div>
            <div className="flex justify-between text-xl text-white">
              <span>Total</span>
              <strong className="text-gold">R$ {formatCurrency(total)}</strong>
            </div>
          </div>
        </aside>
      </main>
    </StoreLayout>
  );
}
