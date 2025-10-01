// src/pages/noticias/NoticiasVer.tsx
import "../../styles/Noticias.css";
import { NavLink } from "react-router-dom";

export default function NoticiasVer() {
  return (
    <div className="noticias-page">
      <article className="noticia-detalle">
        <img
          src="/noticia1.avif"
          alt="Nueva sede comunitaria en construcción"
          className="noticia-imagen"
        />
        <div className="noticia-contenido">
          <h2>Nueva sede comunitaria en construcción</h2>
          <span className="noticia-fecha">10 Septiembre 2025</span>
          <p>
            Comenzaron las obras para la nueva sede social que estará lista en
            diciembre. Este nuevo espacio contará con salas multiuso, áreas de
            reunión y espacios para talleres comunitarios. La iniciativa busca
            fortalecer la participación vecinal y entregar un lugar seguro para
            actividades culturales y deportivas.
          </p>
        </div>
      </article>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <NavLink to="/noticias" className="btn-leer-mas">
          ← Volver a Noticias
        </NavLink>
      </div>
    </div>
  );
}