import {
  Calendar,
  FileText,
  Home,
  Inbox,
  User,
  LogOut,
  Construction,
  ConstructionIcon,
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

const menuItems = [
  {
    title: "Actividades",
    url: "/admin/administraractividades",
    icon: Calendar,
  },
  { title: "Espacios Comunes", url: "/admin/administrarespacios", icon: Home },
  { title: "Noticias", url: "/admin/administrarNoticias", icon: FileText },
  { title: "Solicitudes", url: "/admin/adminsolicitudes", icon: Inbox },
  { title: "Usuarios", url: "/admin/adminsolicitudes", icon: User },
  {
    title: "Proyectos",
    url: "/admin/administrarproyectos",
    icon: ConstructionIcon,
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
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="flex flex-col justify-between h-full">
        {/* 🔹 Menú principal */}
        <div>
          <SidebarGroup>
            <NavLink to={"/admin/dashboards"}>
              <SidebarGroupLabel className="text-sidebar-foreground/70 px-4 py-3 text-xs font-semibold uppercase">
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
                        className="hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
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

        {/* 🔹 Zona inferior: perfil y logout */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button
            onClick={() => navigate("/MiPerfil")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            <User className="h-4 w-4" />
            {open && <span>Editar Perfil</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {open && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
