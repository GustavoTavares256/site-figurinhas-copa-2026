export function PageLoading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-gold" />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <div className="mb-5 h-56 animate-pulse rounded-[1.4rem] bg-white/10" />
      <div className="mb-3 h-4 w-20 animate-pulse rounded-full bg-white/10" />
      <div className="mb-3 h-7 w-3/4 animate-pulse rounded bg-white/10" />
      <div className="mb-6 h-16 animate-pulse rounded bg-white/10" />
      <div className="h-12 animate-pulse rounded-2xl bg-white/10" />
    </article>
  );
}
