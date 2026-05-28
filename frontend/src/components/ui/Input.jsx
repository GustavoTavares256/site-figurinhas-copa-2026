export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-electric/60 focus:ring-4 focus:ring-electric/10 dark:bg-white/10 ${className}`}
      {...props}
    />
  );
}
