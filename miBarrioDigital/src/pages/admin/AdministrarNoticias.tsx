// src/pages/admin/AdministrarNoticias.tsx
import { useEffect, useState } from "react";
import {
  fetchNoticiasPage,
  type PageResult,
  subscribeToNoticias,
} from "../../components/noticias/getNoticias";
import { type Noticia } from "../../types/typeNoticia";
import { NavLink } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

export default function AdministrarNoticias() {
  const [items, setItems] = useState<Noticia[]>([]);
  const [cursor, setCursor] = useState<PageResult["nextCursor"]>();
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 🔹 Escucha en tiempo real
  useEffect(() => {
    const unsubscribe = subscribeToNoticias((noticias) => setItems(noticias));
    return () => unsubscribe();
  }, []);

  // 🔹 Cargar noticias iniciales
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
      soloVisibles: false,
    });

    setItems((prev) => (reset ? res.items : [...prev, ...res.items]));
    setCursor(res.nextCursor);
    setEnd(!res.nextCursor);
    setLoading(false);
  }

  // 🗑️ Eliminar noticia
  async function borrarNoticia(id: string, titulo: string) {
    const confirmacion = window.confirm(
      `¿Seguro que deseas eliminar la noticia "${titulo}"?`
    );
    if (!confirmacion) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "posts", id)); // 👈 colección correcta
      setItems((prev) => prev.filter((n) => n.id !== id));
      alert("✅ Noticia eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la noticia:", error);
      alert("❌ No se pudo eliminar la noticia. Intenta nuevamente.");
    } finally {
      setDeletingId(null);
    }
  }

  // Formateo seguro de fecha (Date o Firestore Timestamp)
  function renderFecha(createdAt: any) {
    try {
      if (!createdAt) return null;
      const d =
        createdAt instanceof Date
          ? createdAt
          : typeof createdAt?.toDate === "function"
          ? createdAt.toDate()
          : new Date(createdAt);
      return d.toLocaleString();
    } catch {
      return String(createdAt);
    }
  }

  return (
    <div className="section" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: ".5rem" }}>Administrar Noticias</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Visualiza o elimina las noticias publicadas.
      </p>

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
                  Publicado: {renderFecha(n.createdAt)}
                </p>
              )}

              {/* 🔘 Botones de acción */}
              <div
                style={{
                  marginTop: ".8rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: ".5rem",
                }}
              >
                {/* 👁️ Botón Ver Noticia (ruta admin) */}
                <NavLink to={`../VerNoticiaAdmin/${n.id}`}>
                  <button
                    style={{
                      background: "var(--brand-blue)",
                      color: "#fff",
                      border: "none",
                      padding: ".5rem .9rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: ".35rem",
                    }}
                  >
                    {/* 👁️ Ícono de ojo */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12C3.75 7.5 7.5 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5s-8.25-3-9.75-7.5z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Ver noticia
                  </button>
                </NavLink>

                {/* 🗑️ Botón Eliminar */}
                <button
                  onClick={() => borrarNoticia(n.id!, n.titulo)}
                  disabled={deletingId === n.id}
                  style={{
                    background: "#d93025",
                    color: "#fff",
                    border: "none",
                    padding: ".5rem .9rem",
                    borderRadius: "8px",
                    cursor: deletingId === n.id ? "not-allowed" : "pointer",
                    opacity: deletingId === n.id ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: ".35rem",
                  }}
                >
                  {/* 🗑️ Ícono de papelera */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h18M9 6V4h6v2m-7 4v8m4-8v8m4-8v8M5 6h14l-1 14H6L5 6z"
                    />
                  </svg>
                  {deletingId === n.id ? "Eliminando…" : "Eliminar"}
                </button>
              </div>
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
