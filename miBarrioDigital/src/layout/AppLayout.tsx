import { Footer, Header } from "../components/Header";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Cargando...</div>;

  // ✅ Mostrar Header solo si no hay sesión o el usuario es vecino
  const mostrarHeader = !user || user.role === "vecino";

  return (
    <div className="min-h-screen bg-[#eaf7ee] flex flex-col">
      {mostrarHeader && <Header />}

      <main className="app flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
