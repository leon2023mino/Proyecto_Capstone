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
  AtSign,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

/* --------------------------
   🔹 Estilo base para NavLink
----------------------------*/
const navClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
    "hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
    isActive
      ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] font-semibold"
      : "text-[hsl(var(--sidebar-foreground))]",
  ].join(" ");

interface AdminLayoutProps {
  title?: string;
  hideTitle?: boolean;
  children?: React.ReactNode;
}

export function AdminLayout({
  title,
  hideTitle = false,
  children,
}: AdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open] = useState(true);

  /* --------------------------
     🔹 Determinar título dinámico
  ----------------------------*/
  const pageTitle = useMemo(() => {
    const last = location.pathname.split("/").filter(Boolean).pop() || "Admin";
    return (
      title ||
      last
        .replace(/-/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
  }, [location.pathname, title]);

  /* --------------------------
     🔹 Logout
  ----------------------------*/
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
      {/* ------------------------------
          🔹 SIDEBAR (IZQUIERDO)
      --------------------------------*/}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r bg-[hsl(var(--sidebar-background))] border-[hsl(var(--sidebar-border))]">
        {/* Encabezado del sidebar */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[hsl(var(--sidebar-border))]">
          <div className="h-9 w-9 rounded-lg grid place-items-center bg-[hsl(var(--sidebar-primary))] text-white font-bold">
            MB
          </div>
          <div>
            <div className="font-bold text-[hsl(var(--sidebar-foreground))]">
              Mi Barrio Digital
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Panel de Administración
            </div>
          </div>
        </div>

        {/* ------------------------------
            🔹 NAVEGACIÓN PRINCIPAL
        --------------------------------*/}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {/* 🏠 Dashboard */}
          <NavLink to="/admin/Dashboards" className={navClasses}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>

          {/* 📁 Proyectos */}
          <div>
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Proyectos
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarProyectos" className={navClasses}>
                <FolderKanban className="h-4 w-4" /> Administrar Proyectos
              </NavLink>
              <NavLink to="/admin/CrearProyecto" className={navClasses}>
                <FilePlus2 className="h-4 w-4" /> Crear Proyecto
              </NavLink>
            </div>
          </div>

          {/* 📰 Noticias */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Noticias
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarNoticias" className={navClasses}>
                <Newspaper className="h-4 w-4" /> Administrar Noticias
              </NavLink>

              <NavLink to="/admin/CrearNoticia" className={navClasses}>
                <FilePlus2 className="h-4 w-4" /> Crear Noticia
              </NavLink>
            </div>
          </div>

          {/* 🏢 Espacios */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Espacios
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/AdministrarEspacios" className={navClasses}>
                <Building2 className="h-4 w-4" /> Administrar Espacios
              </NavLink>
              <NavLink to="/admin/CrearEspacio" className={navClasses}>
                <FilePlus2 className="h-4 w-4" /> Crear Espacio
              </NavLink>
            </div>
          </div>

          {/* 🎉 Actividades */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Actividades
            </div>
            <div className="space-y-1">
              <NavLink
                to="/admin/AdministrarActividades"
                className={navClasses}
              >
                <CalendarDays className="h-4 w-4" /> Administrar Actividades
              </NavLink>
              <NavLink to="/admin/CrearActividad" className={navClasses}>
                <FilePlus2 className="h-4 w-4" /> Crear Actividad
              </NavLink>
            </div>
          </div>

          {/* 📋 Gestión general */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Gestión
            </div>
            <div className="space-y-1">
              <NavLink
                to="/admin/AdministrarSolicitudes"
                className={navClasses}
              >
                <ClipboardList className="h-4 w-4" /> Solicitudes
              </NavLink>

              <NavLink
                to="/admin/AdministrarUsuarios"
                className={navClasses}
              >
                <Users className="h-4 w-4" /> Administrar Usuarios
              </NavLink>

              <NavLink to="/admin/RegistroUserAdmin" className={navClasses}>
                <FilePlus2 className="h-4 w-4" /> Crear Usuario
              </NavLink>
            </div>
          </div>

          {/* 📧 Avisos */}
          <div className="mt-2">
            <div className="px-3 text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
              Avisos
            </div>
            <div className="space-y-1">
              <NavLink to="/admin/EnviarCorreo" className={navClasses}>
                <AtSign className="h-4 w-4" /> Enviar Correo
              </NavLink>
            </div>
          </div>
        </nav>

        {/* ------------------------------
            🔹 FOOTER DEL USUARIO
        --------------------------------*/}
        <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full grid place-items-center bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {user?.email || "admin@mibarriodigital.cl"}
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                Administrador
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-[hsl(var(--sidebar-accent))]"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------
          🔹 CONTENIDO PRINCIPAL
      --------------------------------*/}
      <div className="flex-1 min-w-0 flex flex-col md:ml-0">
        {!hideTitle && (
          <header className="hidden md:flex h-16 items-center gap-3 px-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
            <div className="text-lg font-semibold text-[hsl(var(--foreground))]">
              {pageTitle}
            </div>
          </header>
        )}

        <main className="p-4 md:p-6">{children || <Outlet />}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
