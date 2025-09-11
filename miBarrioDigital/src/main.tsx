import { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./pages/App.tsx";
import Registro from "./pages/Registro.tsx";
import Certificados from "./pages/Certificados.tsx";
import Contacto from "./pages/Contacto.tsx";
import Noticias from "./pages/Noticias.tsx";
import Reservas from "./pages/Reservas.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import Proyectos from "./pages/Proyectos.tsx";
import Home from "./pages/Home.tsx";

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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
