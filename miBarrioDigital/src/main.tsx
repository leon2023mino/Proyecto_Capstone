import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";

import ProtectedRoute from "./components/ProtectedRoute.tsx";

import Registro from "./pages/user/Registro.tsx";
import Certificados from "./pages/user/Certificados.tsx";
import Contacto from "./pages/user/Contacto.tsx";
import Noticias from "./pages/user/Noticias.tsx";
import HacerReservas from "./pages/user/HacerReservas.tsx";
import EspaciosUser from "./pages/user/EspaciosUser.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import Proyectos from "./pages/user/Proyectos.tsx";
import Home from "./pages/user/Home.tsx";
import Login from "./pages/user/Login.tsx";
import ProyectosVer from "./pages/user/ProyectosVer.tsx";
import CrearProyecto from "./pages/admin/CrearProyecto.tsx";
import AdministrarProyectos from "./pages/admin/AdministrarProyectos.tsx";
import VerProyectoAdmin from "./pages/admin/VerProyectoAdmin.tsx";
import AdministrarSolicitudes from "./pages/admin/AdminSolicitudes.tsx";
import NoticiasVer from "./pages/user/NoticiasVer.tsx";
import AdministrarNoticias from "./pages/admin/AdministrarNoticias.tsx";
import VerNoticiaAdmin from "./pages/admin/VerNoticiaAdmin.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import CrearNoticia from "./pages/admin/CrearNoticia.tsx";
import RegistroUserAdmin from "./pages/admin/RegistroUserAdmin.tsx";
import { ListaSolicitudes } from "./pages/admin/ListaSolicitudes.tsx";
import { CambiarContraseña } from "./pages/user/CambiarContraseña.tsx";
import { MiPerfil } from "./pages/user/MiPerfil.tsx";
import ElegirTipoCertificado from "./pages/user/ElegirTipoCertificado.tsx";
import ExportCertificado from "./pages/user/ObetenerCertificado.tsx";
import CrearEspacio from "./pages/admin/CrearEspacio.tsx";
import AdministrarEspacios from "./pages/admin/AdministrarEspacios.tsx";
import AdminSolicitudes from "./pages/admin/AdminSolicitudes.tsx";
import CrearActividad from "./pages/admin/CrearActividad.tsx";
import ActividadesUser from "./pages/user/ActividadesUser.tsx";
import VerActividadAdmin from "./pages/admin/VerActividadAdmin.tsx";
import AdministrarActividades from "./pages/admin/AdministrarActividades.tsx";
import Dashboard from "./pages/admin/Dashboards.tsx";
import { AdminLayout } from "./components/AdminLayout.tsx";

const router = createBrowserRouter([
  {
    //Paginas publias y parara vecinos
    path: "/",
    element: <AppLayout />, // tu página Home
    children: [
      { index: true, element: <Home /> },
      { path: "/registro", element: <Registro /> },
      { path: "/certificados", element: <Certificados /> },
      { path: "/EspaciosUser", element: <EspaciosUser /> },
      { path: "/HacerReservas", element: <HacerReservas /> },
      { path: "/noticias", element: <Noticias /> },
      { path: "/contacto", element: <Contacto /> },
      { path: "/Proyectos", element: <Proyectos /> },
      { path: "/Login", element: <Login /> },
      { path: "/ProyectosVer/:id", element: <ProyectosVer /> },
      { path: "/NoticiasVer/:id", element: <NoticiasVer /> },
      { path: "/CambiarContraseña", element: <CambiarContraseña /> },
      { path: "/MiPerfil", element: <MiPerfil /> },
      { path: "/ElegirTipoCertificado", element: <ElegirTipoCertificado /> },
      { path: "/ObetenerCertificado", element: <ExportCertificado /> },
      { path: "Actividades", element: <ActividadesUser /> },
    ],
  },
  //Pagias solo de admin
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "AdministrarActividades",
            element: <AdministrarActividades />,
          },
          { path: "VerActividadAdmin/:id", element: <VerActividadAdmin /> },
          { path: "Dashboards", element: <Dashboard /> },
          { path: "CrearProyecto", element: <CrearProyecto /> },
          { path: "AdministrarProyectos", element: <AdministrarProyectos /> },
          { path: "VerProyectoAdmin/:id", element: <VerProyectoAdmin /> },
          {
            path: "AdministrarSolicitudes",
            element: <AdministrarSolicitudes />,
          },
          { path: "AdministrarNoticias", element: <AdministrarNoticias /> },
          { path: "VerNoticiaAdmin/:id", element: <VerNoticiaAdmin /> },
          { path: "CrearNoticia", element: <CrearNoticia /> },
          { path: "VerNoticiasAdmin", element: <VerNoticiaAdmin /> },
          { path: "RegistroUserAdmin", element: <RegistroUserAdmin /> },
          { path: "ListaSolicitudes", element: <ListaSolicitudes /> },
          { path: "CrearEspacio", element: <CrearEspacio /> },
          { path: "AdministrarEspacios", element: <AdministrarEspacios /> },
          { path: "AdminSolicitudes", element: <AdminSolicitudes /> },
          { path: "CrearActividad", element: <CrearActividad /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
