import { motion } from "framer-motion";
import Button from "./Button";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-ink p-6 shadow-premium"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
