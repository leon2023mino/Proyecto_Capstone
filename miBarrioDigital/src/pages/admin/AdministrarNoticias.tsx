// src/pages/user/Noticias.tsx (o donde las quieras listar)
import { useEffect, useState } from "react";
import {
  fetchNoticiasPage,
  type PageResult,
  subscribeToNoticias,
} from "../../components/noticias/getNoticias";
import { type Noticia } from "../../types/typeNoticia";
import { NavLink } from "react-router-dom";
// import "../../styles/NoticiasLista.css"; // opcional

export default function NoticiasLista() {
  const [items, setItems] = useState<Noticia[]>([]);
  const [cursor, setCursor] = useState<PageResult["nextCursor"]>();
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    // Suscribirse a los cambios en tiempo real
    const unsubscribe = subscribeToNoticias((noticias) => {
      setItems(noticias);
    });
    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    cargar(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargar(reset = false) {
    if (loading) return;
    setLoading(true);

    const res = await fetchNoticiasPage({
      pageSize: 6,
      cursor: reset ? undefined : cursor,
      soloVisibles: true, // muestra solo dentro de la ventana visible
    });

    setItems((prev) => (reset ? res.items : [...prev, ...res.items]));
    setCursor(res.nextCursor);
    setEnd(!res.nextCursor);
    setLoading(false);
  }

  return (
    <div className="section" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: ".5rem" }}>Noticias</h2>
      <p style={{ color: "var(--text-muted)" }}>Últimas novedades del barrio</p>
      {items.length === 0 && !loading && <p>No hay noticias disponibles.</p>}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: "1rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        {items.map((n) => (
          <li
            key={n.id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
              overflow: "hidden",
            }}
          >
            {n.coverUrl && (
              <img
                src={n.coverUrl}
                alt={n.titulo}
                style={{ width: "100%", height: 220, objectFit: "cover" }}
              />
            )}
            <div style={{ padding: "1rem 1.25rem" }}>
              <h3 style={{ margin: 0, color: "var(--brand-blue)" }}>
                {n.titulo}
              </h3>
              <p style={{ margin: ".5rem 0 0", color: "var(--text)" }}>
                {n.contenido}
              </p>
              {n.createdAt && (
                <p
                  style={{
                    marginTop: ".6rem",
                    fontSize: ".85rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Publicado: {n.createdAt.toLocaleString()}
                </p>
              )}
              <NavLink to="/VerNoticiasAdmin">
                <button>Editar noticia</button>
              </NavLink>
            </div>
          </li>
        ))}
      </ul>

      <div
        style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
      >
        {!end ? (
          <button
            className="button--secondary"
            onClick={() => cargar(false)}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        ) : (
          items.length > 0 && (
            <span style={{ color: "var(--text-muted)" }}>
              No hay más noticias
            </span>
          )
        )}
      </div>
    </div>
  );
}
