import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/VerProyectoAdmin.css";

type Proyecto = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  imagen?: string;
  categoria?: string;
  responsable?: string;
  createdAt?: any;
  updatedAt?: any;
};

export default function VerProyectoAdmin() {
  const { id } = useParams<{ id: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Campos editables
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("");
  const [responsable, setResponsable] = useState("");

  // 🔹 Obtener datos de Firestore
  useEffect(() => {
    const fetchProyecto = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "proyectos", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as Proyecto;
          setProyecto({ ...data, id: snap.id });
          setTitulo(data.titulo ?? "");
          setDescripcion(data.descripcion ?? "");
          setEstado(data.estado ?? "");
          setImagen(data.imagen ?? "");
          setCategoria(data.categoria ?? "");
          setResponsable(data.responsable ?? "");
        }
      } catch (err) {
        console.error("Error al obtener el proyecto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [id]);

  // 💾 Guardar cambios
  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setMessage(null);
    try {
      const ref = doc(db, "proyectos", id);
      const updates = {
        titulo,
        descripcion,
        estado,
        imagen,
        categoria,
        responsable,
        updatedAt: new Date(),
      };
      await updateDoc(ref, updates);
      setProyecto((prev) => (prev ? { ...prev, ...updates } : prev));
      setMessage("✅ Cambios guardados correctamente.");
    } catch (err) {
      console.error("Error guardando proyecto:", err);
      setMessage("❌ Error al guardar los cambios.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // 🗑️ Eliminar proyecto
  const handleDelete = async () => {
    if (!id) return;
    const confirmar = confirm("¿Seguro que deseas eliminar este proyecto?");
    if (!confirmar) return;
    try {
      await deleteDoc(doc(db, "proyectos", id));
      alert("✅ Proyecto eliminado correctamente.");
      window.location.href = "/AdministrarProyectos";
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar el proyecto.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando proyecto...</p>;
  if (!proyecto)
    return <p style={{ textAlign: "center" }}>No se encontró el proyecto.</p>;

  return (
    <div className="ver-proyecto-admin">
      {imagen && <img src={imagen} alt={titulo} className="portada" />}

      <div className="proyecto-admin-content">
        <h2>Editar proyecto</h2>

        <div className="field">
          <label>Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="field">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={6}
          />
        </div>

        <div className="field">
          <label>URL de imagen</label>
          <input
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="field">
          <label>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Selecciona un estado</option>
            <option value="En curso">En curso</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        <div className="field">
          <label>Categoría</label>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Ej: Comunal, Ambiental..."
          />
        </div>

        <div className="field">
          <label>Responsable</label>
          <input
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            placeholder="Ej: Junta de Vecinos, Comité..."
          />
        </div>

        <div className="actions">
          <div className="actions-left">
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <NavLink to="/admin/AdministrarProyectos">
              <button className="btn-secondary">← Volver</button>
            </NavLink>

            <button className="btn-danger" onClick={handleDelete}>
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
    </div>
  );
}
