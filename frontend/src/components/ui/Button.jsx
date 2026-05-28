export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-gold to-amber-500 text-ink shadow-[0_18px_42px_rgba(255,213,0,.18)] hover:-translate-y-0.5",
    secondary:
      "border border-white/10 bg-white/10 text-white hover:bg-white/15",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-slate-300 hover:bg-white/10"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
