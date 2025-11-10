import { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/VerNoticiaAdmin.css";

type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha?: any;
  lugar?: string;
  cupos?: number;
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

  // 🔹 Convertir timestamp a formato input datetime-local
  const toInputDateTime = (v: any) => {
    if (!v) return "";
    const d = typeof v.toDate === "function" ? v.toDate() : new Date(v);
    return d.toISOString().slice(0, 16);
  };

  // 🔹 Obtener datos de la actividad
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
          setCupos(data.cupos ?? "");
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

  // 🔹 Guardar cambios
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
        cupos: Number(cupos) || 0,
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

  // 🔹 Eliminar actividad
  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm("¿Eliminar esta actividad?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "actividades", id));
      alert("✅ Actividad eliminada correctamente.");
      navigate("/AdministrarActividades");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ No se pudo eliminar la actividad.");
    }
  };

  // 🕓 Estado de carga
  if (loading) return <p style={{ textAlign: "center" }}>Cargando actividad...</p>;
  if (!actividad)
    return <p style={{ textAlign: "center" }}>No se encontró la actividad.</p>;

  return (
    <div className="ver-noticia-admin">
      <div className="noticia-admin-content">
        <h2>Editar actividad</h2>

        {/* Campos */}
        <div className="field">
          <label>Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="field">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
          />
        </div>

        <div className="field-group">
          <div className="field">
            <label>Fecha de realización</label>
            <input
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>

        <div className="field-group">
          <div className="field">
            <label>Lugar</label>
            <input
              type="text"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Ej: Sede vecinal central"
            />
          </div>
          <div className="field">
            <label>Cupos</label>
            <input
              type="number"
              value={cupos}
              onChange={(e) => setCupos(e.target.value)}
              min={0}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="actions">
          <div className="actions-left">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <NavLink to="/AdministrarActividades">
              <button className="btn-secondary">← Volver</button>
            </NavLink>
          </div>

          <button
            className="button--danger"
            style={{ marginLeft: "auto" }}
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("Error") ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
