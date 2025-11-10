import { NavLink } from "react-router-dom";
import { subscribeToNoticias } from "../../components/noticias/getNoticias";
import { type Noticia } from "../../types/typeNoticia";
import "../../styles/Noticias.css";
import { useEffect, useState } from "react";

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToNoticias((items) => {
      setNoticias(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="noticias-page">
      <h2>Noticias del Barrio</h2>
      <p>Mantente informado sobre las actividades, proyectos y anuncios de tu comunidad.</p>

      {loading ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>Cargando noticias...</p>
      ) : noticias.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          No hay noticias disponibles por el momento.
        </p>
      ) : (
        <div className="noticias-lista">
          {noticias.map((n) => (
            <article key={n.id} className="noticia-card">
              {n.coverUrl && <img src={n.coverUrl} alt={n.titulo} loading="lazy" />}
              <div className="noticia-contenido">
                <h3>{n.titulo}</h3>
                <span className="noticia-fecha">
                  {n.createdAt instanceof Date
                    ? n.createdAt.toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Fecha desconocida"}
                </span>
                <p>
                  {n.contenido?.length > 120
                    ? n.contenido.slice(0, 120) + "..."
                    : n.contenido || "Sin contenido."}
                </p>

                <NavLink to={`/NoticiasVer/${n.id}`} className="btn-leer-mas">
                  Leer más →
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
