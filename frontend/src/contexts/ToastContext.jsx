import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(() => setToast(null), 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/90 px-5 py-4 text-sm font-bold text-white shadow-premium backdrop-blur-xl">
          {toast.type === "error" ? (
            <FiXCircle className="text-xl text-red-400" />
          ) : (
            <FiCheckCircle className="text-xl text-emerald" />
          )}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}
