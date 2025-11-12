import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/AdminProyectos.css"; // puedes crear AdminActividades.css si prefieres

type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: any;
  lugar?: string;
  cupos?: number;
  estado?: string;
  createdAt?: any;
};

export default function AdministrarActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔹 Escucha en tiempo real de Firestore
  useEffect(() => {
    const q = query(collection(db, "actividades"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Actividad),
        id: doc.id, // ✅ id siempre al final
      }));
      setActividades(docs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 🗑️ Eliminar actividad
  async function eliminarActividad(id: string, titulo: string) {
    const confirmar = window.confirm(`¿Eliminar la actividad "${titulo}"?`);
    if (!confirmar) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "actividades", id));
      alert("✅ Actividad eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      alert("❌ No se pudo eliminar la actividad.");
    } finally {
      setDeletingId(null);
    }
  }

  // 🕓 Formatear fecha
  function formatFecha(fecha: any) {
    if (!fecha) return "Sin fecha";
    try {
      const d =
        typeof fecha.toDate === "function" ? fecha.toDate() : new Date(fecha);
      return d.toLocaleString();
    } catch {
      return String(fecha);
    }
  }

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando actividades...</p>;

  return (
    <div className="section" style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ marginBottom: ".5rem" }}>Administrar Actividades</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Visualiza, elimina o crea nuevas actividades comunitarias.
      </p>

      <div style={{ marginBottom: "1rem", textAlign: "right" }}>
        <button
          className="button--secondary"
          onClick={() => navigate("/CrearActividad")}
        >
          + Nueva actividad
        </button>
      </div>

      {actividades.length === 0 ? (
        <p>No hay actividades registradas.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "grid",
            gap: "1rem",
          }}
        >
          {actividades.map((a) => (
            <li
              key={a.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "12px",
                background: "var(--surface)",
                boxShadow: "var(--shadow)",
                overflow: "hidden",
                padding: "1rem 1.25rem",
              }}
            >
              <h3 style={{ margin: 0, color: "var(--brand-blue, #0f3d91)" }}>
                {a.titulo}
              </h3>
              <p style={{ marginTop: ".4rem", color: "var(--text)" }}>
                {a.descripcion}
              </p>
              <p
                style={{
                  marginTop: ".6rem",
                  fontSize: ".9rem",
                  color: "var(--text-muted)",
                }}
              >
                📅 {formatFecha(a.fecha)} <br />
                📍 {a.lugar || "Sin lugar definido"} <br />
                🎟️ Cupos: {a.cupos ?? "N/A"}
              </p>

              {/* 🔘 Botones */}
              <div
                style={{
                  marginTop: ".8rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: ".5rem",
                }}
              >
                <NavLink to={`../VerActividadAdmin/${a.id}`}>
                  <button
                    style={{
                      background: "var(--brand-blue, #0f3d91)",
                      color: "#fff",
                      border: "none",
                      padding: ".5rem .9rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    👁️ Ver
                  </button>
                </NavLink>

                <button
                  onClick={() => eliminarActividad(a.id, a.titulo)}
                  disabled={deletingId === a.id}
                  style={{
                    background: "#d93025",
                    color: "#fff",
                    border: "none",
                    padding: ".5rem .9rem",
                    borderRadius: "8px",
                    cursor: deletingId === a.id ? "not-allowed" : "pointer",
                    opacity: deletingId === a.id ? 0.7 : 1,
                  }}
                >
                  🗑️ {deletingId === a.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
