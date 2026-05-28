import api from "./api";

export async function listProducts(params = {}) {
  const { data } = await api.get("/products", { params });
  return Array.isArray(data) ? data : [];
}

export async function createProduct(formData) {
  const { data } = await api.post("/products", formData);
  return data;
}

export async function updateProduct(id, formData) {
  const { data } = await api.put(`/products/${id}`, formData);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
