// src/components/AdminLayout.tsx
import { useState, useMemo } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  Newspaper,
  Building2,
  Users,
  CalendarDays,
  LogOut,
  FilePlus2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

/** Clases para NavLink activo/inactivo */
const navClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
    "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
    isActive
      ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] font-semibold"
      : "text-[hsl(var(--sidebar-foreground))]",
  ].join(" ");

export function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const pageTitle = useMemo(() => {
    const last = location.pathname.split("/").filter(Boolean).pop() || "admin";
    return last
      .replace(/-/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* SIDEBAR */}
      <aside
        className={[
          "hidden md:flex md:flex-col w-64 shrink-0 border-r",
          "bg-[hsl(var(--sidebar-background))] border-[hsl(var(--sidebar-border))]",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[hsl(var(--sidebar-border))]">
          <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#0f3d91] text-white font-bold">
            MB
          </div>
          <div className="leading-tight">
            <div className="font-bold text-[hsl(var(--sidebar-foreground))]">
              Mi Barrio Digital
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Panel de Administración
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          <NavLink to="/admin/Dashboards" className={navClasses}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          {/* Proyectos */}
          <div>
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Proyectos
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarProyectos" className={navClasses}>
                <FolderKanban className="h-4 w-4" />
                Administrar Proyectos
              </NavLink>
              <NavLink to="/admin/CrearProyecto" className={navClasses}>
                <FilePlus2 className="h-4 w-4" />
                Crear Proyecto
              </NavLink>
            </div>
          </div>

          {/* Noticias */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Noticias
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarNoticias" className={navClasses}>
                <Newspaper className="h-4 w-4" />
                Administrar Noticias
              </NavLink>
            </div>
          </div>

          {/* Espacios */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Espacios
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarEspacios" className={navClasses}>
                <Building2 className="h-4 w-4" />
                Administrar Espacios
              </NavLink>
              <NavLink to="/admin/CrearEspacio" className={navClasses}>
                <FilePlus2 className="h-4 w-4" />
                Crear Espacio
              </NavLink>
            </div>
          </div>

          {/* Actividades */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Actividades
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarActividades" className={navClasses}>
                <CalendarDays className="h-4 w-4" />
                Administrar Actividades
              </NavLink>
              <NavLink to="/admin/CrearActividad" className={navClasses}>
                <FilePlus2 className="h-4 w-4" />
                Crear Actividad
              </NavLink>
            </div>
          </div>

          {/* Solicitudes y Usuarios */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Gestión
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarSolicitudes" className={navClasses}>
                <ClipboardList className="h-4 w-4" />
                Solicitudes
              </NavLink>
              <NavLink to="/admin/RegistroUserAdmin" className={navClasses}>
                <Users className="h-4 w-4" />
                Crear Usuario
              </NavLink>
            </div>
          </div>
        </nav>

{/* Footer usuario */}
<div className="border-t border-gray-200 bg-[#f9fafb] p-4 rounded-tr-lg">
  <div className="flex items-center gap-3">
    {/* Avatar */}
    <div className="h-10 w-10 rounded-full bg-[#0f3d91] text-white grid place-items-center font-bold text-sm shadow-sm">
      {user?.email?.[0]?.toUpperCase() || "A"}
    </div>

    {/* Info usuario */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 truncate">
        {user?.email || "admin@mibarriodigital.cl"}
      </p>
      <p className="text-xs text-gray-500">Administrador</p>
    </div>

    {/* Botón logout */}
    <button
      onClick={handleLogout}
      title="Cerrar sesión"
      className="h-9 w-9 flex items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm"
    >
      <LogOut className="h-4 w-4" />
    </button>
  </div>
</div>

      </aside>

      {/* TOPBAR (solo título) */}
      <header className="hidden md:flex h-16 items-center px-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
        <h1 className="text-lg font-semibold text-[#0f3d91]">{pageTitle}</h1>
      </header>

      {/* MAIN */}
      <div className="flex-1 min-w-0 flex flex-col md:ml-0">
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
