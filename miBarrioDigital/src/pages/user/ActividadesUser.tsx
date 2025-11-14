import "../../styles/ActividadesUser.css";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

export type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  responsable?: string;
  imagen?: string;
  estado: string;
  cupoTotal: number;
  cupoDisponible: number;
};

type EstadoSolicitud = "pendiente" | "aprobada" | "rechazada" | null;

const SOLICITUDES_COLLECTION = "requests";

export default function ActividadesUser() {
  const { user } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [estadoSolicitudes, setEstadoSolicitudes] = useState<
    Record<string, EstadoSolicitud>
  >({});

  // 🔹 Escucha actividades activas
 useEffect(() => {
  const q = query(collection(db, "actividades"), orderBy("fecha", "asc"));
  const unsub = onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((d) => {
      const data = d.data() as Actividad;

      return {
        ...data,
        id: d.id, // asegurado
      };
    });

    setActividades(docs.filter((a) => a.estado === "Activo"));
    setLoading(false);
  });
    return () => unsub();
  }, []);

  // 🔹 Estado de solicitudes del usuario
  useEffect(() => {
    if (!user) return;

    const fetchSolicitudes = async () => {
      const q = query(
        collection(db, SOLICITUDES_COLLECTION),
        where("usuarioId", "==", user.uid),
        where("tipo", "==", "actividad")
      );

      const snap = await getDocs(q);
      const estados: Record<string, EstadoSolicitud> = {};

      snap.forEach((d) => {
        const data = d.data();
        estados[data.actividadId] = data.estado;
      });

      setEstadoSolicitudes(estados);
    };

    fetchSolicitudes();
  }, [user]);

  // 🔹 Enviar solicitud
  const solicitarCupo = async (act: Actividad) => {
    if (!user) return alert("Debes iniciar sesión.");

    const estadoActual = estadoSolicitudes[act.id];

    if (estadoActual === "pendiente") return alert("Ya tienes solicitud pendiente.");
    if (estadoActual === "aprobada") return alert("Ya estás inscrito.");
    if (act.cupoDisponible <= 0) return alert("Sin cupos disponibles.");

    if (!confirm(`¿Enviar solicitud para "${act.titulo}"?`)) return;

    try {
      setEnviando(act.id);

      const ref = doc(db, SOLICITUDES_COLLECTION, `${act.id}_${user.uid}`);
      await setDoc(ref, {
        tipo: "actividad",
        actividadId: act.id,
        usuarioId: user.uid,
        tituloActividad: act.titulo,
        estado: "pendiente",
        createdAt: new Date(),
        datos: {
          nombre: user.displayName ?? "Usuario",
          email: user.email ?? "",
        },
      });

      setEstadoSolicitudes((prev) => ({
        ...prev,
        [act.id]: "pendiente",
      }));

      alert("Solicitud enviada.");
    } catch (error) {
      alert("Error al enviar solicitud.");
      console.error(error);
    } finally {
      setEnviando(null);
    }
  };

  // 🔹 Chip estado solicitud
  const solicitudChip = (estado: EstadoSolicitud) =>
    estado === "pendiente"
      ? "chip-pendiente"
      : estado === "aprobada"
      ? "chip-aprobada"
      : estado === "rechazada"
      ? "chip-rechazada"
      : "";

  if (loading) return <p style={{ textAlign: "center" }}>Cargando actividades...</p>;

  return (
    <div className="proyectos-page">
      {/* Header igual que Proyectos */}
      <div className="proyectos-header">
        <div>
          <h2 className="proyectos-title">Actividades Comunitarias</h2>
          <p className="proyectos-subtitle">
            Postula a talleres, operativos y actividades del barrio.
          </p>
        </div>

        {/* Vista usuario: sin búsqueda */}
        <div></div>
      </div>

      {actividades.length === 0 ? (
        <p className="no-data">No hay actividades disponibles.</p>
      ) : (
        <div className="proyectos-lista">
          {actividades.map((a) => {
            const estadoSolicitud = estadoSolicitudes[a.id] ?? null;

            return (
              <article key={a.id} className="proyecto-card">
                {/* Imagen superior */}
                {a.imagen ? (
                  <img className="proyecto-thumb" src={a.imagen} alt={a.titulo} />
                ) : (
                  <div className="proyecto-thumb sin-imagen">Sin imagen</div>
                )}

                <div className="proyecto-body">
                  <h3>{a.titulo}</h3>

                  {estadoSolicitud && (
                    <span className={`estado ${solicitudChip(estadoSolicitud)}`}>
                      {estadoSolicitud === "pendiente"
                        ? "Pendiente"
                        : estadoSolicitud === "aprobada"
                        ? "Aprobada"
                        : "Rechazada"}
                    </span>
                  )}

                  <p className="proyecto-desc">{a.descripcion}</p>

                  <small className="fecha-publicacion">
                    📅 {a.fecha} — 🕓 {a.hora}
                  </small>

                  <div className="proyecto-actions">
                    <button
                      onClick={() => solicitarCupo(a)}
                      disabled={
                        enviando === a.id ||
                        estadoSolicitud === "pendiente" ||
                        estadoSolicitud === "aprobada" ||
                        a.cupoDisponible <= 0
                      }
                      className="btn-ver-mas"
                    >
                      {enviando === a.id
                        ? "Enviando..."
                        : estadoSolicitud === "pendiente"
                        ? "Pendiente"
                        : estadoSolicitud === "aprobada"
                        ? "Inscrito"
                        : a.cupoDisponible <= 0
                        ? "Sin cupos"
                        : "Solicitar"}
                    </button>
                  </div>
                </div>

                {/* Información extra abajo */}
                <div className="proyecto-meta">
                  <span className="meta-chip">Lugar: {a.lugar}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
