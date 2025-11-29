// src/components/AdminSidebar.tsx
import {
  Calendar,
  FileText,
  Home,
  Inbox,
  User,
  LogOut,
  Building2,
  Newspaper,
  ClipboardList,
  FolderKanban,
  Mail,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/** Items del menú principal */
const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/Dashboards",
    icon: Home,
  },
  {
    title: "Administrar usuarios", // 👈 NUEVO
    url: "/admin/AdministrarUsuarios",
    icon: User,
  },
  {
    title: "Actividades",
    url: "/admin/AdministrarActividades",
    icon: Calendar,
  },
  {
    title: "Proyectos",
    url: "/admin/AdministrarProyectos",
    icon: FolderKanban,
  },
  {
    title: "Noticias",
    url: "/admin/AdministrarNoticias",
    icon: Newspaper,
  },
  {
    title: "Espacios comunes",
    url: "/admin/AdministrarEspacios",
    icon: Building2,
  },
  {
    title: "Solicitudes",
    url: "/admin/AdministrarSolicitudes",
    icon: ClipboardList,
  },
  {
    title: "Correos masivos",
    url: "/admin/EnviarCorreo",
    icon: Mail,
  },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))]"
    >
      <SidebarContent className="flex flex-col justify-between h-full">
        {/* 🔹 MENÚ PRINCIPAL */}
        <div>
          <SidebarGroup>
           <NavLink to={"/admin/Dashboards"}>
  <SidebarGroupLabel className="text-[#0f3d91] font-bold text-sm px-4 py-3 uppercase tracking-wider">
    Panel Admin
  </SidebarGroupLabel>
</NavLink>

            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150",
                            isActive
                              ? "bg-[#0f3d91]/10 text-[#0f3d91] font-semibold"
                              : "text-[hsl(var(--sidebar-foreground))] hover:bg-[#0f3d91]/10 hover:text-[#0f3d91]",
                          ].join(" ")
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* 🔹 PERFIL / LOGOUT */}
        <div className="p-3 border-t border-[hsl(var(--sidebar-border))] space-y-2">
          <button
            onClick={() => navigate("/MiPerfil")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#0f3d91]/10 text-[hsl(var(--sidebar-foreground))] transition-colors"
          >
            <User className="h-4 w-4" />
            {open && <span>Editar Perfil</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[#c92a3b] hover:bg-[#c92a3b]/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {open && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;
