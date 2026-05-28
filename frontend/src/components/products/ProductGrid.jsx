import EmptyState from "../ui/EmptyState";
import { ProductSkeleton } from "../ui/Loading";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="Nenhum produto encontrado"
        description="Tente mudar o filtro ou buscar outro termo."
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
