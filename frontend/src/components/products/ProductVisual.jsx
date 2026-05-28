const categoryLabels = {
  albuns: "Album",
  envelopes: "Envelope",
  boxes: "Box",
  combos: "Combo",
  kits: "Kit",
  selecoes: "Selecao",
  raras: "Rara",
  cards: "Card",
  premium: "Premium",
  pacotes: "Pack"
};

function shouldUseImage(image = "") {
  if (!image) return false;
  const lower = image.toLowerCase();
  return !lower.includes("pexels.com") && !lower.includes("unsplash.com");
}

export default function ProductVisual({ product, imageUrl, className = "" }) {
  if (shouldUseImage(imageUrl)) {
    return (
      <img
        src={imageUrl}
        alt={product.name}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const category = String(product.category || "produto").toLowerCase();
  const label = categoryLabels[category] || "Copa";

  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br from-[#0352a6] via-[#062247] to-[#00a878] p-5 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,213,0,.28),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,.18),transparent_18%),linear-gradient(135deg,rgba(255,255,255,.08),transparent_42%)]" />
      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase text-ink">
        2026
      </div>
      <div className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase text-ink">
        {label}
      </div>
      <div className="relative w-full rounded-[1.4rem] border border-white/30 bg-white/15 p-6 text-center shadow-premium backdrop-blur">
        <span className="block text-xs font-black uppercase tracking-[.28em] text-gold">
          Copa Stickers
        </span>
        <strong className="mt-6 block text-5xl font-black tracking-tight text-white">
          {product.icon || "CS"}
        </strong>
        <p className="mx-auto mt-5 max-w-48 text-sm font-black leading-5 text-white">
          {product.name}
        </p>
      </div>
    </div>
  );
}
