export default function DashboardCard({ title, value, icon }) {
  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-white/5 p-6 shadow-premium">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-xl text-ink">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <strong className="mt-2 block text-3xl font-black text-white">{value}</strong>
    </article>
  );
}
