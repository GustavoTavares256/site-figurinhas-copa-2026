import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { FiBox, FiDollarSign, FiShoppingBag, FiTrendingDown, FiCalendar, FiPackage } from "react-icons/fi";
import AdminSidebar from "../components/admin/AdminSidebar";
import DashboardCard from "../components/admin/DashboardCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { formatCurrency, getImageUrl } from "../services/api";
import { getDashboard } from "../services/dashboardService";
import { createProduct, deleteProduct, listProducts, updateProduct } from "../services/productService";
import { deleteOrder, listAdminOrders, updateOrderStatus } from "../services/orderService";

const emptyProduct = {
  name: "",
  price: "",
  stock: "",
  category: "albuns",
  icon: "ALBUM",
  description: ""
};

const statusLabels = {
  pending: "Recebido",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado"
};

export default function Admin() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  async function loadAdminData() {
    const [dashboardData, productsData, ordersData] = await Promise.all([
      getDashboard(),
      listProducts(),
      listAdminOrders()
    ]);

    setDashboard(dashboardData);
    setProducts(productsData);
    setOrders(ordersData);
  }

  useEffect(() => {
    loadAdminData().catch((error) => showToast(error.message || "Erro ao carregar admin.", "error"));
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query));
  }, [products, search]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  function updateProductField(event) {
    setProductForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setProductForm({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "albuns",
      icon: product.icon || "ALBUM",
      description: product.description || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      setSaving(true);
      if (editingId) {
        await updateProduct(editingId, formData);
        showToast("Produto atualizado.");
      } else {
        await createProduct(formData);
        showToast("Produto criado.");
      }
      setProductForm(emptyProduct);
      setEditingId(null);
      setImage(null);
      await loadAdminData();
    } catch (error) {
      showToast(error.response?.data?.message || "Erro ao salvar produto.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Deseja excluir este produto?")) return;
    await deleteProduct(id);
    showToast("Produto excluido.");
    await loadAdminData();
  }

  async function handleStatus(orderId, status) {
    await updateOrderStatus(orderId, status);
    showToast("Status atualizado.");
    await loadAdminData();
  }

  async function handleDeleteOrder(id) {
    if (!confirm("Deseja excluir este pedido?")) return;
    await deleteOrder(id);
    showToast("Pedido excluido.");
    await loadAdminData();
  }

  const statusRows = dashboard?.ordersByStatus || [];
  const maxStatus = Math.max(...statusRows.map((row) => Number(row.total)), 1);

  return (
    <main className="flex min-h-screen bg-pitch text-white">
      <AdminSidebar />
      <section className="min-w-0 flex-1 px-5 py-8 lg:px-10">
        <header className="mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-emerald">ERP</span>
          <h1 className="mt-2 text-4xl font-black">Painel Admin</h1>
          <p className="mt-2 text-slate-400">Gestao de produtos, estoque, pedidos e receita.</p>
        </header>

        <section id="dashboard" className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          <DashboardCard title="Produtos" value={dashboard?.totalProducts || 0} icon={<FiBox />} />
          <DashboardCard title="Pedidos" value={dashboard?.totalOrders || 0} icon={<FiShoppingBag />} />
          <DashboardCard title="Pedidos hoje" value={dashboard?.ordersToday || 0} icon={<FiCalendar />} />
          <DashboardCard title="Vendidos" value={dashboard?.productsSold || 0} icon={<FiPackage />} />
          <DashboardCard title="Receita" value={`R$ ${formatCurrency(dashboard?.totalRevenue || 0)}`} icon={<FiDollarSign />} />
          <DashboardCard title="Estoque baixo" value={dashboard?.lowStockProducts || 0} icon={<FiTrendingDown />} />
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
          <h2 className="text-2xl font-black">Analytics</h2>
          <div className="mt-6 grid gap-8 xl:grid-cols-2">
            <div>
              <h3 className="mb-4 font-black text-white">Pedidos por status</h3>
              <div className="grid gap-4">
                {statusRows.map((row) => (
                  <div key={row.status}>
                    <div className="mb-2 flex justify-between text-sm text-slate-300">
                      <span>{statusLabels[row.status] || row.status}</span>
                      <strong>{row.total}</strong>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold to-electric"
                        style={{ width: `${(Number(row.total) / maxStatus) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-black text-white">Faturamento 7 dias</h3>
              <div className="flex h-44 items-end gap-3 rounded-3xl bg-white/5 p-4">
                {(dashboard?.revenueByDay || []).map((row) => {
                  const maxRevenue = Math.max(
                    ...(dashboard?.revenueByDay || []).map((item) => Number(item.revenue)),
                    1
                  );
                  return (
                    <div key={row.date} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-electric to-gold"
                        style={{ height: `${Math.max((Number(row.revenue) / maxRevenue) * 100, 8)}%` }}
                        title={`R$ ${formatCurrency(row.revenue)}`}
                      />
                      <span className="text-[10px] text-slate-400">
                        {new Date(row.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                {(dashboard?.revenueByDay || []).length === 0 && (
                  <p className="m-auto text-sm text-slate-400">Sem vendas no periodo.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
            <h2 className="text-xl font-black">Produtos mais vendidos</h2>
            <div className="mt-5 grid gap-3">
              {(dashboard?.topProducts || []).map((product) => (
                <div key={`${product.product_id}-${product.name}`} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-white">{product.name}</span>
                    <strong className="text-gold">{product.totalSold} un.</strong>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">R$ {formatCurrency(product.revenue)}</p>
                </div>
              ))}
              {(dashboard?.topProducts || []).length === 0 && <p className="text-sm text-slate-400">Sem vendas ainda.</p>}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
            <h2 className="text-xl font-black">Ultimos pedidos</h2>
            <div className="mt-5 grid gap-3">
              {(dashboard?.latestOrders || []).map((order) => (
                <div key={order.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex justify-between gap-3">
                    <span className="font-bold text-white">#{order.id} {order.customer_name}</span>
                    <strong className="text-gold">R$ {formatCurrency(order.total)}</strong>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{statusLabels[order.status] || order.status}</p>
                </div>
              ))}
              {(dashboard?.latestOrders || []).length === 0 && <p className="text-sm text-slate-400">Sem pedidos ainda.</p>}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
            <h2 className="text-xl font-black">Estoque baixo</h2>
            <div className="mt-5 grid gap-3">
              {(dashboard?.lowStockItems || []).map((product) => (
                <div key={product.id} className="flex justify-between gap-3 rounded-2xl bg-white/5 p-4">
                  <span className="font-bold text-white">{product.name}</span>
                  <strong className="text-red-300">{product.stock}</strong>
                </div>
              ))}
              {(dashboard?.lowStockItems || []).length === 0 && <p className="text-sm text-slate-400">Estoque saudavel.</p>}
            </div>
          </div>
        </section>

        <section id="products" className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <form onSubmit={handleProductSubmit} className="h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
            <h2 className="text-2xl font-black">{editingId ? "Editar produto" : "Cadastrar produto"}</h2>
            <div className="mt-6 grid gap-4">
              <Input name="name" placeholder="Nome" value={productForm.name} onChange={updateProductField} required />
              <Input name="price" type="number" step="0.01" placeholder="Preco" value={productForm.price} onChange={updateProductField} required />
              <Input name="stock" type="number" placeholder="Estoque" value={productForm.stock} onChange={updateProductField} required />
              <Input name="category" placeholder="Categoria" value={productForm.category} onChange={updateProductField} required />
              <Input name="icon" placeholder="Icone" value={productForm.icon} onChange={updateProductField} />
              <textarea
                name="description"
                placeholder="Descricao"
                value={productForm.description}
                onChange={updateProductField}
                className="min-h-32 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white outline-none"
              />
              <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} className="text-sm text-slate-300" />
              <Button type="submit" disabled={saving}>{saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar produto"}</Button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-black">Produtos</h2>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto..." className="md:max-w-xs" />
            </div>
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <article key={product.id} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-[120px_1fr_auto]">
                  <div className="h-28 overflow-hidden rounded-2xl bg-white/10">
                    {product.image && <img src={getImageUrl(product.image)} alt={product.name} className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <h3 className="font-black">{product.name}</h3>
                    <p className="text-sm text-slate-400">{product.category} · Estoque {product.stock}</p>
                    <strong className="mt-2 block text-gold">R$ {formatCurrency(product.price)}</strong>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <Button variant="secondary" onClick={() => startEdit(product)}>Editar</Button>
                    <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Excluir</Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="orders" className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-premium">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black">Pedidos</h2>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Todos</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <article key={order.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-black">Pedido #{order.id}</h3>
                    <p className="text-sm text-slate-400">{order.customer?.name} · {order.customer?.phone}</p>
                    <p className="text-sm text-slate-400">{order.customer?.address}</p>
                  </div>
                  <strong className="text-gold">R$ {formatCurrency(order.total)}</strong>
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                  {(order.items || []).map((item) => (
                    <li key={`${order.id}-${item.product_name}`}>{item.quantity}x {item.product_name}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Select value={order.status} onChange={(event) => handleStatus(order.id, event.target.value)}>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                  <Button variant="danger" onClick={() => handleDeleteOrder(order.id)}>Excluir pedido</Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
