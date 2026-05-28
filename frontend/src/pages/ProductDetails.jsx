import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import { PageLoading } from "../components/ui/Loading";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import StoreLayout from "../layouts/StoreLayout";
import { formatCurrency, getImageUrl } from "../services/api";
import useProducts from "../hooks/useProducts";
import ProductVisual from "../components/products/ProductVisual";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const product = useMemo(
    () => products.find((item) => Number(item.id) === Number(id)),
    [products, id]
  );

  if (loading) {
    return (
      <StoreLayout>
        <Navbar />
        <PageLoading />
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <Navbar />
        <main className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h1 className="text-4xl font-black text-white">Produto nao encontrado</h1>
          <Link to="/">
            <Button className="mt-6">Voltar para loja</Button>
          </Link>
        </main>
      </StoreLayout>
    );
  }

  const imageUrl = getImageUrl(product.image);

  function handleAdd() {
    const result = addToCart(product);
    showToast(result.message, result.ok ? "success" : "error");
  }

  return (
    <StoreLayout>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-2 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <ProductVisual product={product} imageUrl={imageUrl} className="min-h-[420px]" />
        </div>
        <section>
          <span className="rounded-full bg-electric/15 px-4 py-2 text-xs font-black uppercase text-electric">
            {product.category}
          </span>
          <h1 className="mt-6 text-5xl font-black text-white">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{product.description}</p>
          <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Preco</span>
              <strong className="text-3xl font-black text-gold">R$ {formatCurrency(product.price)}</strong>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-slate-400">Estoque</span>
              <strong className="text-emerald">{product.stock} unidades</strong>
            </div>
          </div>
          <Button className="mt-8 w-full" onClick={handleAdd} disabled={Number(product.stock) <= 0}>
            Adicionar ao carrinho
          </Button>
        </section>
      </main>
    </StoreLayout>
  );
}
