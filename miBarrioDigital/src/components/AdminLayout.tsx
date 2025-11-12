import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSideBar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AdminSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold tracking-tight">
              Panel de Administración
            </h1>
          </header>

          {/* 👇 Aquí React Router renderiza los hijos */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
