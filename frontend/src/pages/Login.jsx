import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  function updateField(event) {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      await login(credentials);
      showToast("Login realizado.");
      navigate("/admin");
    } catch (error) {
      showToast(error.response?.data?.message || "Erro ao fazer login.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-pitch px-5 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-premium backdrop-blur-xl">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-gold text-2xl text-ink">
          <FiLock />
        </div>
        <span className="block text-center text-xs font-black uppercase tracking-widest text-emerald">
          Area administrativa
        </span>
        <h1 className="mt-3 text-center text-4xl font-black">Login Admin</h1>
        <p className="mt-3 text-center text-sm text-slate-400">
          Acesse o painel para gerenciar produtos, pedidos e estoque.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <Input name="email" type="email" placeholder="E-mail" value={credentials.email} onChange={updateField} required />
          <Input name="password" type="password" placeholder="Senha" value={credentials.password} onChange={updateField} required />
          <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar no painel"}</Button>
        </form>
      </section>
    </main>
  );
}
