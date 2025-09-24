import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";

import Registro from "./pages/Registro.tsx";
import Certificados from "./pages/Certificados.tsx";
import Contacto from "./pages/Contacto.tsx";
import Noticias from "./pages/Noticias.tsx";
import Reservas from "./pages/Reservas.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import Proyectos from "./pages/Proyectos.tsx";
import Home from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";

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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
