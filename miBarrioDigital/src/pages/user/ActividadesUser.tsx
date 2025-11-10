import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  increment,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/ActividadesUser.css";
import { useAuth } from "../../context/AuthContext";

type Actividad = {
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

export default function ActividadesUser() {
  const { user } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [inscribiendo, setInscribiendo] = useState<string | null>(null);

  // 🔹 Cargar actividades activas en tiempo real
  useEffect(() => {
    const q = query(collection(db, "actividades"), orderBy("fecha", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Actividad),
        id: doc.id, // ✅ id al final para evitar el warning de TypeScript
      }));

      // Filtrar solo las actividades activas
      setActividades(docs.filter((a) => a.estado === "Activo"));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔹 Inscribirse en una actividad
  const inscribirse = async (id: string) => {
    if (!user) {
      alert("Debes iniciar sesión para inscribirte.");
      return;
    }

    const actividad = actividades.find((a) => a.id === id);
    if (!actividad) return;

    if (actividad.cupoDisponible <= 0) {
      alert("⚠️ No quedan cupos disponibles para esta actividad.");
      return;
    }

    const confirmar = confirm(`¿Deseas inscribirte en "${actividad.titulo}"?`);
    if (!confirmar) return;

    try {
      setInscribiendo(id);
      const ref = doc(db, "actividades", id);

      // 🔽 Decrementar cupo disponible
      await updateDoc(ref, {
        cupoDisponible: increment(-1),
      });

      // 🔹 Registrar al usuario en la subcolección "inscritos"
      await addDoc(collection(db, "actividades", id, "inscritos"), {
        uid: user.uid,
        email: user.email,
        nombre: user.displayName || "Usuario sin nombre",
        fechaInscripcion: new Date(),
      });

      alert("✅ Te has inscrito correctamente en la actividad.");
    } catch (error) {
      console.error("Error al inscribirse:", error);
      alert("❌ Ocurrió un error al intentar inscribirte.");
    } finally {
      setInscribiendo(null);
    }
  };

  if (loading) return <p className="loading">Cargando actividades...</p>;

  return (
    <div className="actividades-page">
      <header className="actividades-header">
        <h2 className="actividades-title">Actividades Vecinales</h2>
        <p className="actividades-subtitle">
          Participa en las actividades de tu comunidad. Revisa los cupos
          disponibles y únete.
        </p>
      </header>

      {actividades.length === 0 ? (
        <p>No hay actividades disponibles en este momento.</p>
      ) : (
        <div className="actividades-grid">
          {actividades.map((a) => (
            <article key={a.id} className="actividad-card">
              {a.imagen && (
                <img src={a.imagen} alt={a.titulo} className="actividad-img" />
              )}

              <div className="actividad-content">
                <h3 className="actividad-titulo">{a.titulo}</h3>
                <p className="actividad-desc">{a.descripcion}</p>

                <div className="actividad-info">
                  <p>
                    <b>📅 Fecha:</b> {a.fecha}
                  </p>
                  <p>
                    <b>🕓 Hora:</b> {a.hora}
                  </p>
                  <p>
                    <b>📍 Lugar:</b> {a.lugar}
                  </p>
                  {a.responsable && (
                    <p>
                      <b>👤 Responsable:</b> {a.responsable}
                    </p>
                  )}
                  <p>
                    <b>🎟️ Cupos disponibles:</b> {a.cupoDisponible}
                  </p>
                </div>

                <div className="actividad-actions">
                  <button
                    onClick={() => inscribirse(a.id)}
                    disabled={a.cupoDisponible <= 0 || inscribiendo === a.id}
                    className={`btn-inscribirse ${
                      a.cupoDisponible <= 0 ? "btn-disabled" : ""
                    }`}
                  >
                    {inscribiendo === a.id
                      ? "Inscribiendo..."
                      : a.cupoDisponible <= 0
                      ? "Sin cupos"
                      : "Inscribirme"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
