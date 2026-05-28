export default function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none transition focus:border-electric/60 focus:ring-4 focus:ring-electric/10 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
