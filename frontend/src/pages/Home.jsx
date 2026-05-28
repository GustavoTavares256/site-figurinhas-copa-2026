import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/products/ProductGrid";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { useCart } from "../contexts/CartContext";
import StoreLayout from "../layouts/StoreLayout";
import useProducts from "../hooks/useProducts";

const ITEMS_PER_PAGE = 9;

export default function Home() {
  const { products, loading, error } = useProducts();
  const { favorites } = useCart();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = products.filter((product) => {
      const matchesCategory =
        category === "all" || String(product.category).toLowerCase() === category;
      const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      return matchesCategory && text.includes(query);
    });

    if (sort === "price-asc") next.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") next.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name") next.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    if (sort === "favorites") {
      next.sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)));
    }

    return next;
  }, [products, category, search, sort, favorites]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const pageProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function changeCategory(value) {
    setCategory(value);
    setPage(1);
    window.setTimeout(() => {
      document.getElementById("store")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <StoreLayout>
      <Navbar activeCategory={category} onCategoryChange={changeCategory} />

      <section className="relative overflow-hidden px-5 py-16 lg:px-10 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(0,180,255,.22),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(255,213,0,.16),transparent_22%),radial-gradient(circle_at_70%_90%,rgba(0,200,117,.18),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span className="mb-6 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gold">
              Copa do Mundo 2026
            </span>
            <h1 className="max-w-4xl text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
              Colecionaveis com experiencia de loja premium.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Albuns, envelopes, boxes, combos e cards especiais para completar sua colecao com uma jornada rapida, bonita e organizada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => document.getElementById("store").scrollIntoView({ behavior: "smooth" })}>
                Ver produtos <FiArrowRight />
              </Button>
              <Button variant="secondary" onClick={() => setSort("favorites")}>
                Favoritos primeiro
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 2, y: 20 }}
            animate={{ opacity: 1, rotate: -2, y: 0 }}
            className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-electric/80 to-emerald/80 p-8 shadow-premium"
          >
            <div className="rounded-[1.8rem] border border-white/30 p-8">
              <span className="font-black uppercase tracking-[.35em] text-gold">Collector</span>
              <strong className="mt-10 block text-7xl font-black tracking-tight text-white">2026</strong>
              <p className="mt-3 text-lg font-black text-white">Album, cards e boxes premium</p>
            </div>
          </motion.div>
        </div>
      </section>

      <main id="store" className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald">Loja</span>
            <h2 className="mt-2 text-4xl font-black text-white">Produtos em destaque</h2>
            <p className="mt-2 text-slate-400">{filteredProducts.length} produto(s) encontrado(s)</p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px]">
            <label className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar figurinhas..."
                className="pl-11"
              />
            </label>
            <Select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="default">Ordenar</option>
              <option value="price-asc">Menor preco</option>
              <option value="price-desc">Maior preco</option>
              <option value="name">Nome</option>
              <option value="favorites">Favoritos</option>
            </Select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <ProductGrid products={pageProducts} loading={loading} />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button variant="secondary" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
            Anterior
          </Button>
          <span className="text-sm font-bold text-slate-400">
            Pagina {page} de {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page === totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Proxima
          </Button>
        </div>
      </main>
    </StoreLayout>
  );
}
