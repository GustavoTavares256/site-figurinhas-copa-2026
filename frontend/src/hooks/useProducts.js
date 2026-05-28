import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../services/productService";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await listProducts();
        if (active) setProducts(data);
      } catch (err) {
        if (active) setError(err.message || "Erro ao carregar produtos.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => ({ products, loading, error, setProducts }), [products, loading, error]);
}
