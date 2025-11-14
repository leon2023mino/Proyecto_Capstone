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
import "../../styles/AdminActividades.css";

type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: any;
  hora?: string;
  lugar?: string;
  cupoTotal?: number;
  cupoDisponible?: number;
  imagen?: string;
  estado?: string;
  createdAt?: any;
};

export default function AdministrarActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔹 Cargar actividades ordenadas por fecha ascendente
  useEffect(() => {
    const q = query(collection(db, "actividades"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Actividad),
        id: doc.id,
      }));
      setActividades(docs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 🗑️ Eliminar actividad
  async function eliminarActividad(id: string, titulo: string) {
    const confirmar = window.confirm(
      `¿Eliminar la actividad "${titulo}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "actividades", id));
      alert("🗑️ Actividad eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      alert("❌ No se pudo eliminar la actividad.");
    } finally {
      setDeletingId(null);
    }
  }

  const formatearFecha = (fecha: any) => {
    if (!fecha) return "Sin fecha";
    try {
      const d =
        typeof fecha.toDate === "function" ? fecha.toDate() : new Date(fecha);
      return d.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(fecha);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando actividades...</p>;

  return (
    <div className="admin-actividades-page">
      {/* Header con estilo de Proyectos */}
      <div className="admin-actividades-header">
        <div>
          <h2 className="admin-title">Administrar Actividades</h2>
          <p className="admin-subtitle">
            Crea, gestiona y elimina actividades comunitarias.
          </p>
        </div>

        <button
          className="btn-admin-blue"
      onClick={() => navigate("/admin/CrearActividad")}

        >
          + Nueva actividad
        </button>
      </div>

      {actividades.length === 0 ? (
        <p className="no-data">No hay actividades registradas.</p>
      ) : (
        <div className="admin-actividades-grid">
          {actividades.map((a) => (
            <div key={a.id} className="actividad-card-admin">
              {/* Imagen */}
              {a.imagen ? (
                <img className="actividad-thumb" src={a.imagen} alt={a.titulo} />
              ) : (
                <div className="actividad-thumb sin-imagen">Sin imagen</div>
              )}

              {/* Contenido */}
              <div className="actividad-body">
                <h3>{a.titulo}</h3>

                {a.estado && (
                  <span className={`estado-chip estado-${a.estado.toLowerCase()}`}>
                    {a.estado}
                  </span>
                )}

                <p className="actividad-desc">{a.descripcion}</p>

                <div className="actividad-info">
                  <p>
                    <b>📅 Fecha:</b> {formatearFecha(a.fecha)}
                  </p>
                  {a.hora && (
                    <p>
                      <b>🕓 Hora:</b> {a.hora}
                    </p>
                  )}
                  <p>
                    <b>📍 Lugar:</b> {a.lugar || "Sin lugar"}
                  </p>
                  {a.cupoTotal && (
                    <p>
                      <b>🎟️ Cupos:</b> {a.cupoDisponible} / {a.cupoTotal}
                    </p>
                  )}
                </div>

                {/* Botones */}
                <div className="actividad-actions">
                  <NavLink
  to={`/admin/VerActividadAdmin/${a.id}`}
  className="btn-admin-blue-outline"
>
  👁 Ver
</NavLink>

                  <button
                    onClick={() => eliminarActividad(a.id, a.titulo)}
                    className="btn-admin-red"
                    disabled={deletingId === a.id}
                  >
                    {deletingId === a.id ? "Eliminando..." : "🗑 Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
