import { FiInbox } from "react-icons/fi";

export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center">
      <FiInbox className="mx-auto mb-4 text-4xl text-slate-500" />
      <h3 className="text-xl font-black text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
    </div>
  );
}
