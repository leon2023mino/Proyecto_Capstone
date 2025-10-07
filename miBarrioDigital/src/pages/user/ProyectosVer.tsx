// src/pages/proyectos/ProyectosVer.tsx
import "../../styles/Proyectos.css";
import { NavLink } from "react-router-dom";

// ✅ Importa la imagen desde src/assets
import img1 from "../../assets/proyecto1.jpg";

export default function ProyectosVer() {
  return (
    <div className="proyectos-page">
      <article className="proyecto-detalle">
        {/* Imagen grande del proyecto */}
        <img
          src={img1}
          alt="Plaza con Juegos Infantiles"
          className="proyecto-imagen"
        />

        {/* Contenido principal */}
        <div className="proyecto-contenido">
          <h2>Plaza con Juegos Infantiles</h2>
          <span className="estado estado-en-curso">🟢 En curso</span>
          <p>
            Proyecto aprobado para instalar juegos infantiles y máquinas de
            ejercicio en la plaza central. Se busca fomentar la actividad física
            y ofrecer un espacio seguro para niños, jóvenes y adultos. La obra
            contempla además bancas, luminarias y áreas verdes para toda la
            comunidad.
          </p>
        </div>
      </article>

      {/* Botón para volver */}
      <div style={{ marginTop: "1.5rem" }}>
        <NavLink to="/proyectos" className="btn-ver-mas">
          ← Volver a Proyectos
        </NavLink>
      </div>
    </div>
  );
}