import { AnimatePresence, motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { formatCurrency } from "../services/api";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    coupon,
    subtotal,
    discount,
    total
  } = useCart();
  const { showToast } = useToast();

  function handleCoupon(event) {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("coupon");
    const ok = applyCoupon(code);
    showToast(ok ? "Cupom aplicado." : "Cupom invalido.", ok ? "success" : "error");
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink/95 shadow-premium backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <h2 className="text-2xl font-black text-white">Seu carrinho</h2>
                <p className="text-sm text-slate-400">{items.length} produto(s)</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-400">
                  Seu carrinho esta vazio.
                </p>
              )}
              {items.map((item) => (
                <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-black text-white">{item.name}</h3>
                      <p className="text-sm text-slate-400">R$ {formatCurrency(item.price)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-300 hover:text-red-200"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <FiMinus />
                      </button>
                      <span className="w-8 text-center font-black text-white">{item.quantity}</span>
                      <button
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <strong className="text-gold">
                      R$ {formatCurrency(item.price * item.quantity)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-white/10 p-5">
              <form onSubmit={handleCoupon} className="mb-4 flex gap-2">
                <Input name="coupon" defaultValue={coupon} placeholder="Cupom" />
                <Button type="submit">Aplicar</Button>
              </form>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong>R$ {formatCurrency(subtotal)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Desconto</span>
                  <strong>R$ {formatCurrency(discount)}</strong>
                </div>
                <div className="flex justify-between text-lg text-white">
                  <span>Total</span>
                  <strong>R$ {formatCurrency(total)}</strong>
                </div>
              </div>
              <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                <Button className="mt-5 w-full" disabled={items.length === 0}>
                  Finalizar compra
                </Button>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
