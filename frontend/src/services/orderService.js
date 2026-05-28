import api from "./api";

export async function checkoutOrder(payload) {
  const { data } = await api.post("/checkout", payload);
  return data;
}

export async function listCustomerOrders(phone) {
  const { data } = await api.get(`/orders/customer/${phone}`);
  return Array.isArray(data) ? data : [];
}

export async function listAdminOrders(status) {
  const { data } = await api.get("/admin/orders", {
    params: status && status !== "all" ? { status } : {}
  });
  return Array.isArray(data) ? data : [];
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status });
  return data;
}

export async function deleteOrder(id) {
  const { data } = await api.delete(`/admin/orders/${id}`);
  return data;
}
