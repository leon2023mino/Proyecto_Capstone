import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/AdminProyectos.css";

type Proyecto = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  categoria?: string;
  imagen?: string;
  createdAt?: any;
};

export default function AdministrarProyectos() {
  const [items, setItems] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 🔹 Cargar proyectos desde Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, "proyectos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Proyecto),
        id: doc.id, // ✅ se mueve al final para evitar conflicto
      }));
      setItems(docs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 🗑️ Eliminar proyecto
  async function borrarProyecto(id: string, titulo: string) {
    const confirmacion = window.confirm(
      `¿Seguro que deseas eliminar el proyecto "${titulo}"?`
    );
    if (!confirmacion) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "proyectos", id));
      setItems((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Proyecto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      alert("❌ No se pudo eliminar el proyecto. Intenta nuevamente.");
    } finally {
      setDeletingId(null);
    }
  }

  // 🕐 Formatear fecha
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

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando proyectos...</p>;

  return (
    <div className="section" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: ".5rem" }}>Administrar Proyectos</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Visualiza o elimina los proyectos publicados.
      </p>

      {items.length === 0 && !loading && <p>No hay proyectos disponibles.</p>}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: "1rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        {items.map((p) => (
          <li
            key={p.id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
              overflow: "hidden",
            }}
          >
            {p.imagen && (
              <img
                src={p.imagen}
                alt={p.titulo}
                style={{ width: "100%", height: 220, objectFit: "cover" }}
              />
            )}
            <div style={{ padding: "1rem 1.25rem" }}>
              <h3 style={{ margin: 0, color: "var(--brand-blue)" }}>
                {p.titulo}
              </h3>
              <p style={{ margin: ".5rem 0 0", color: "var(--text)" }}>
                {p.descripcion}
              </p>

              {p.createdAt && (
                <p
                  style={{
                    marginTop: ".6rem",
                    fontSize: ".85rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Creado: {renderFecha(p.createdAt)}
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
                {/* 👁️ Ver proyecto */}
                <NavLink to={`../VerProyectoAdmin/${p.id}`}>
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
                    {/* Ícono ojo */}
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
                    Ver proyecto
                  </button>
                </NavLink>

                {/* 🗑️ Eliminar */}
                <button
                  onClick={() => borrarProyecto(p.id, p.titulo)}
                  disabled={deletingId === p.id}
                  style={{
                    background: "#d93025",
                    color: "#fff",
                    border: "none",
                    padding: ".5rem .9rem",
                    borderRadius: "8px",
                    cursor: deletingId === p.id ? "not-allowed" : "pointer",
                    opacity: deletingId === p.id ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: ".35rem",
                  }}
                >
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
                  {deletingId === p.id ? "Eliminando…" : "Eliminar"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
