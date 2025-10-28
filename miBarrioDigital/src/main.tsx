import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";

import Registro from "./pages/user/Registro.tsx";
import Certificados from "./pages/user/Certificados.tsx";
import Contacto from "./pages/user/Contacto.tsx";
import Noticias from "./pages/user/Noticias.tsx";
import Reservas from "./pages/user/Reservas.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import Proyectos from "./pages/user/Proyectos.tsx";
import Home from "./pages/user/Home.tsx";
import Login from "./pages/user/Login.tsx";
import ProyectosVer from "./pages/user/ProyectosVer.tsx";
import CrearProyecto from "./pages/admin/CrearProyecto.tsx";
import AdministrarProyectos from "./pages/admin/AdministrarProyectos.tsx";
import VerProyectoAdmin from "./pages/admin/VerProyectoAdmin.tsx";
import AdministrarSolicitudes from "./pages/admin/AdministarSolicitudes.tsx";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // tu página Home
    children: [
      { index: true, element: <Home /> },
      { path: "/registro", element: <Registro /> },
      { path: "/certificados", element: <Certificados /> },
      { path: "/reservas", element: <Reservas /> },
      { path: "/noticias", element: <Noticias /> },
      { path: "/contacto", element: <Contacto /> },
      { path: "/Proyectos", element: <Proyectos /> },
      { path: "/Login", element: <Login /> },
      { path: "/ProyectosVer", element: <ProyectosVer /> },
      { path: "/CrearProyecto", element: <CrearProyecto /> },
      { path: "/AdministrarProyectos", element: <AdministrarProyectos /> },
      { path: "/VerProyectoAdmin", element: <VerProyectoAdmin /> },
      { path: "/AdministrarSolicitudes", element: <AdministrarSolicitudes /> },
      { path: "/NoticiasVer/:id", element: <NoticiasVer /> },
      { path: "/AdministrarNoticias", element: <AdministrarNoticias /> },
      { path: "/VerNoticiaAdmin/:id", element: <VerNoticiaAdmin /> },
      { path: "/CrearNoticia", element: <CrearNoticia /> },
      { path: "/VerNoticiasAdmin", element: <VerNoticiaAdmin /> },
      { path: "/RegistroUserAdmin", element: <RegistroUserAdmin /> },
      { path: "/ListaSolicitudes", element: <ListaSolicitudes /> },
      { path: "/CambiarContraseña", element: <CambiarContraseña /> },
      { path: "/MiPerfil", element: <MiPerfil /> },
      { path: "/ElegirTipoCertificado", element: <ElegirTipoCertificado /> },
      { path: "/ObetenerCertificado", element: <ExportCertificado /> },
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
