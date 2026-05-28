import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import StoreLayout from "../layouts/StoreLayout";

export default function Success() {
  const orderId = localStorage.getItem("lastOrderId");

  return (
    <StoreLayout>
      <Navbar />
      <main className="grid min-h-[70vh] place-items-center px-5 py-16">
        <section className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-premium">
          <FiCheckCircle className="mx-auto mb-5 text-6xl text-emerald" />
          <h1 className="text-4xl font-black text-white">Pedido recebido</h1>
          <p className="mt-4 text-slate-300">
            {orderId ? `Seu pedido #${orderId} foi criado com sucesso.` : "Seu pedido foi criado com sucesso."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/orders">
              <Button>Ver meus pedidos</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">Voltar para loja</Button>
            </Link>
          </div>
        </section>
      </main>
    </StoreLayout>
  );
}
