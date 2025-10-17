import { NavLink } from "react-router";
import { subscribeToNoticias } from "../../components/noticias/getNoticias";

// ✅ Import imágenes desde assets
import noticia1 from "../../assets/noticia1.avif";
import noticia2 from "../../assets/noticia2.jpg";

import { type Noticia } from "../../types/typeNoticia";
import "../../styles/Noticias.css";
import { useEffect, useState } from "react";

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  useEffect(() => {
    const unsubscribe = subscribeToNoticias((items) => {
      setNoticias(items);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="noticias-page">
      <h2>Noticias del Barrio</h2>
      <p>Mantente informado sobre lo que ocurre en tu comunidad.</p>

      <div className="noticias-lista">
        {noticias.map((n) => (
          <article key={n.id} className="noticia-card">
            {n.coverUrl && <img src={n.coverUrl} alt={n.titulo} />}
            <div className="noticia-contenido">
              <h3>{n.titulo}</h3>
              <span className="noticia-fecha">
                {n.createdAt
                  ? n.createdAt.toLocaleDateString()
                  : "Fecha desconocida"}
              </span>
              <p>{n.contenido}</p>
              <NavLink to="/NoticiasVer" className="btn-leer-mas">
                Leer más
              </NavLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
