import { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/AdminActividades.css"; // Usa el estilo azul institucional

type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha?: any;
  hora?: string;
  lugar?: string;
  cupoTotal?: number;
  cupoDisponible?: number;
  imagen?: string;
  estado?: string;
  createdAt?: any;
};

export default function VerActividadAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Campos editables
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [cupos, setCupos] = useState<number | string>("");
  const [estado, setEstado] = useState("Activo");

  // Convertir timestamp a datetime-local
  const toInputDateTime = (v: any) => {
    if (!v) return "";
    const d = typeof v.toDate === "function" ? v.toDate() : new Date(v);
    return d.toISOString().slice(0, 16);
  };

  // Obtener datos de la actividad
  useEffect(() => {
    const fetchActividad = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "actividades", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as Actividad;
          setActividad({ ...data, id: snap.id });
          setTitulo(data.titulo ?? "");
          setDescripcion(data.descripcion ?? "");
          setFecha(toInputDateTime(data.fecha));
          setLugar(data.lugar ?? "");
          setCupos(data.cupoTotal ?? "");
          setEstado(data.estado ?? "Activo");
        } else {
          setMessage("No se encontró la actividad.");
        }
      } catch (err) {
        console.error("Error al obtener actividad:", err);
        setMessage("Error al cargar la actividad.");
      } finally {
        setLoading(false);
      }
    };
    fetchActividad();
  }, [id]);

  // Guardar cambios
  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setMessage(null);

    try {
      const ref = doc(db, "actividades", id);
      const updates = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        lugar: lugar.trim(),
        cupoTotal: Number(cupos) || 0,
        estado,
        fecha: fecha ? new Date(fecha) : null,
        updatedAt: new Date(),
      };

      await updateDoc(ref, updates);

      setMessage("✅ Cambios guardados correctamente.");
      setActividad((prev) => (prev ? { ...prev, ...updates } : prev));
    } catch (err) {
      console.error("Error guardando cambios:", err);
      setMessage("❌ Error al guardar los cambios.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Eliminar
  const handleDelete = async () => {
    if (!id) return;
    const confirmar = window.confirm("¿Eliminar esta actividad?");
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "actividades", id));
      alert("🗑 Actividad eliminada.");
      navigate("/admin/AdministrarActividades");
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("❌ No se pudo eliminar.");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando actividad...</p>;
  if (!actividad)
    return <p style={{ textAlign: "center" }}>No se encontró la actividad.</p>;

  return (
    <div className="admin-actividad-ver-page">
      <div className="admin-ver-card">
        <h2 className="admin-title">Editar Actividad</h2>
        <p className="admin-subtitle">
          Modifica la información registrada de esta actividad comunitaria.
        </p>

        {/* Imagen */}
        {actividad.imagen && (
          <img className="admin-ver-thumb" src={actividad.imagen} alt={titulo} />
        )}

        {/* TITULO */}
        <div className="field">
          <label>Título</label>
          <input
            className="input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div className="field">
          <label>Descripción</label>
          <textarea
            className="textarea"
            rows={5}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        {/* FECHA + ESTADO */}
        <div className="field-group">
          <div className="field">
            <label>Fecha</label>
            <input
              type="datetime-local"
              className="input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Estado</label>
            <select
              className="input"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>

        {/* LUGAR + CUPOS */}
        <div className="field-group">
          <div className="field">
            <label>Lugar</label>
            <input
              className="input"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Cupos</label>
            <input
              className="input"
              type="number"
              value={cupos}
              onChange={(e) => setCupos(e.target.value)}
            />
          </div>
        </div>

        {/* ACCIONES */}
        <div className="admin-ver-actions">
          <button
            className="btn-admin-blue"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          <NavLink to="/admin/AdministrarActividades" className="btn-admin-blue-outline">
            ← Volver
          </NavLink>

          <button className="btn-admin-red" onClick={handleDelete}>
            🗑 Eliminar
          </button>
        </div>

        {/* MENSAJE */}
        {message && (
          <div
            className={`message ${message.includes("Error") ? "error" : "success"}`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
