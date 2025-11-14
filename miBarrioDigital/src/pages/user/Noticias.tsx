import { NavLink } from "react-router-dom";
import { subscribeToNoticias } from "../../components/noticias/getNoticias";
import { type Noticia } from "../../types/typeNoticia";
import "../../styles/Noticias.css";
import { useEffect, useState } from "react";

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToNoticias((items) => {
      setNoticias(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "#6b7280", marginTop: "1rem" }}>
        Cargando noticias...
      </p>
    );
  }

  return (
    <main className="proyectos-page">
      {/* Header igual al de Proyectos */}
      <div className="proyectos-header">
        <div>
          <h2 className="proyectos-title">Noticias del Barrio</h2>
          <p className="proyectos-subtitle">
            Mantente informado sobre las novedades, actividades y anuncios de la comunidad.
          </p>
        </div>

        {/* Noticias no necesita búsqueda ni filtros */}
        <div></div>
      </div>

      {noticias.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280", marginTop: "1rem" }}>
          No hay noticias disponibles.
        </p>
      ) : (
        <div className="proyectos-lista">
          {noticias.map((n) => (
            <article key={n.id} className="proyecto-card">
              {/* Imagen superior */}
              {n.coverUrl ? (
                <img
                  className="proyecto-thumb"
                  src={n.coverUrl}
                  alt={n.titulo}
                  loading="lazy"
                />
              ) : (
                <div className="proyecto-thumb sin-imagen">Sin imagen</div>
              )}

              <div className="proyecto-body">
                <h3>{n.titulo}</h3>

                {/* Fecha chip */}
                <span className="estado estado-pendiente">
                  {n.createdAt instanceof Date
                    ? n.createdAt.toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Fecha desconocida"}
                </span>

                {/* Descripción */}
                <p className="proyecto-desc">
                  {n.contenido
                    ? n.contenido.length > 140
                      ? n.contenido.slice(0, 140) + "..."
                      : n.contenido
                    : "Sin contenido."}
                </p>

                <div className="proyecto-actions">
                  <NavLink to={`/NoticiasVer/${n.id}`} className="btn-ver-mas">
                    Leer más
                  </NavLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
