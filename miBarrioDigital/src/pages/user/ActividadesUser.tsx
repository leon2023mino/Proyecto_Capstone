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

// 🔹 Tipo de actividad
export type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  responsable?: string;
  imagen?: string;
  estado: "Activo" | "Inactivo" | string;
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

  // 🔹 Cargar actividades activas
  useEffect(() => {
    const q = query(collection(db, "actividades"), orderBy("fecha", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({
        ...(d.data() as Actividad),
        id: d.id,
      }));
      setActividades(docs.filter((a) => a.estado === "Activo"));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 🔹 Cargar estado de solicitudes del usuario
  useEffect(() => {
    if (!user) return;

    const cargarSolicitudes = async () => {
      const q = query(
        collection(db, SOLICITUDES_COLLECTION),
        where("usuarioId", "==", user.uid),
        where("tipo", "==", "actividad")
      );
      const snapshot = await getDocs(q);
      const estados: Record<string, EstadoSolicitud> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.actividadId) estados[data.actividadId] = data.estado;
      });

      setEstadoSolicitudes(estados);
    };

    cargarSolicitudes();
  }, [user]);

  // 🔹 Enviar solicitud
  const solicitarCupo = async (actividad: Actividad) => {
    if (!user) {
      alert("Debes iniciar sesión para solicitar cupo.");
      return;
    }

    if (actividad.cupoDisponible <= 0) {
      alert("⚠️ No quedan cupos disponibles.");
      return;
    }

    const estadoActual = estadoSolicitudes[actividad.id];
    if (estadoActual === "pendiente") {
      alert("⚠️ Ya tienes una solicitud pendiente.");
      return;
    }
    if (estadoActual === "aprobada") {
      alert("✅ Ya estás inscrito en esta actividad.");
      return;
    }

    const confirmar = confirm(
      `¿Deseas enviar una solicitud para "${actividad.titulo}"?`
    );
    if (!confirmar) return;

    try {
      setEnviando(actividad.id);
      const solicitudId = `${actividad.id}_${user.uid}`;
      const ref = doc(db, SOLICITUDES_COLLECTION, solicitudId);

      await setDoc(
        ref,
        {
          tipo: "actividad",
          estado: "pendiente",
          createdAt: new Date(),
          actividadId: actividad.id,
          tituloActividad: actividad.titulo,
          usuarioId: user.uid,
          datos: {
            nombre: user.displayName || "Usuario sin nombre",
            email: user.email || "",
          },
        },
        { merge: true }
      );

      setEstadoSolicitudes((prev) => ({
        ...prev,
        [actividad.id]: "pendiente",
      }));

      alert("✅ Solicitud enviada. Espera la aprobación del administrador.");
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      alert("❌ Error al enviar la solicitud.");
    } finally {
      setEnviando(null);
    }
  };

  // 🔹 Clase visual para el estado
  const estadoClass = (estado: string | null) =>
    estado
      ? `estado-chip ${
          estado === "pendiente"
            ? "chip-pendiente"
            : estado === "aprobada"
            ? "chip-aprobada"
            : "chip-rechazada"
        }`
      : "";

  // 🔹 Render
  if (loading)
    return <p className="loading">Cargando actividades...</p>;

  return (
    <div className="actividades-page">
      <header className="actividades-header">
        <h2 className="actividades-title">Actividades Vecinales</h2>
        <p className="actividades-subtitle">
          Descubre las actividades disponibles y postula a las que te interesen.
        </p>
      </header>

      {actividades.length === 0 ? (
        <p className="no-data">No hay actividades registradas.</p>
      ) : (
        <div className="actividades-lista">
          {actividades.map((a) => {
            const estado = estadoSolicitudes[a.id] || null;

            return (
              <article key={a.id} className="actividad-card">
                {/* Imagen */}
                {a.imagen ? (
                  <img
                    className="actividad-thumb"
                    src={a.imagen}
                    alt={a.titulo}
                  />
                ) : (
                  <div className="actividad-thumb sin-imagen">Sin imagen</div>
                )}

                {/* Contenido */}
                <div className="actividad-body">
                  <h3>{a.titulo}</h3>

                  {estado && (
                    <span className={estadoClass(estado)}>
                      {estado === "pendiente"
                        ? "🕓 Pendiente"
                        : estado === "aprobada"
                        ? "✅ Aprobada"
                        : "❌ Rechazada"}
                    </span>
                  )}

                  <p className="actividad-desc">{a.descripcion}</p>

                  <div className="actividad-info">
                    <p><b>📅 Fecha:</b> {a.fecha}</p>
                    <p><b>🕓 Hora:</b> {a.hora}</p>
                    <p><b>📍 Lugar:</b> {a.lugar}</p>
                    {a.responsable && (
                      <p><b>👤 Responsable:</b> {a.responsable}</p>
                    )}
                    <p><b>🎟️ Cupos disponibles:</b> {a.cupoDisponible}</p>
                  </div>

                  <div className="actividad-actions">
                    <button
                      onClick={() => solicitarCupo(a)}
                      disabled={
                        a.cupoDisponible <= 0 ||
                        enviando === a.id ||
                        estado === "pendiente" ||
                        estado === "aprobada"
                      }
                      className={`btn-solicitar ${
                        a.cupoDisponible <= 0 ||
                        estado === "pendiente" ||
                        estado === "aprobada"
                          ? "btn-disabled"
                          : ""
                      }`}
                    >
                      {enviando === a.id
                        ? "Enviando..."
                        : estado === "pendiente"
                        ? "Pendiente"
                        : estado === "aprobada"
                        ? "Inscrito"
                        : a.cupoDisponible <= 0
                        ? "Sin cupos"
                        : "Solicitar cupo"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
