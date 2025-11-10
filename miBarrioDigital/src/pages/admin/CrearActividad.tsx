// src/pages/admin/CrearActividad.tsx
import { useState } from "react";
import "../../styles/CrearActividad.css";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { resizeImage } from "../../components/noticias/ResizeImage";

const MAX_DESC = 800;
const isHttpUrl = (v: string) => /^https?:\/\/.+/i.test(v.trim());

export default function CrearActividad() {
  const [actividad, setActividad] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    cupoTotal: "",
    responsable: "",
    imagenUrl: "",
    estado: "Activo",
    createdAt: Timestamp.now(),
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const descRest = MAX_DESC - actividad.descripcion.length;
  const imagenValida = !actividad.imagenUrl || isHttpUrl(actividad.imagenUrl);

  const formIsValid =
    actividad.titulo.trim().length > 0 &&
    actividad.descripcion.trim().length > 0 &&
    actividad.fecha &&
    actividad.hora &&
    actividad.lugar.trim().length > 0 &&
    Number(actividad.cupoTotal) > 0 &&
    imagenValida;

  // 🧭 Manejo de inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setActividad((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 Manejo de imagen
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // 🧾 Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIsValid) return;
    setSubiendo(true);

    let imagenFinal = actividad.imagenUrl.trim();

    try {
      if (imagenFile) {
        const resized = await resizeImage(imagenFile, 900, 600);
        imagenFinal = await uploadImage(
          resized,
          `actividades/imagenes/${Date.now()}-${resized.name}`
        );
      }

      const payload = {
        titulo: actividad.titulo.trim(),
        descripcion: actividad.descripcion.trim(),
        fecha: actividad.fecha,
        hora: actividad.hora,
        lugar: actividad.lugar.trim(),
        cupoTotal: Number(actividad.cupoTotal),
        cupoDisponible: Number(actividad.cupoTotal),
        responsable: actividad.responsable.trim() || null,
        imagen: imagenFinal || null,
        estado: actividad.estado,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "actividades"), payload);
      alert("✅ Actividad creada correctamente.");

      setActividad({
        titulo: "",
        descripcion: "",
        fecha: "",
        hora: "",
        lugar: "",
        cupoTotal: "",
        responsable: "",
        imagenUrl: "",
        estado: "Activo",
        createdAt: Timestamp.now(),
      });
      setImagenFile(null);
      setImagenPreview(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error al crear la actividad.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleReset = () => {
    setActividad({
      titulo: "",
      descripcion: "",
      fecha: "",
      hora: "",
      lugar: "",
      cupoTotal: "",
      responsable: "",
      imagenUrl: "",
      estado: "Activo",
      createdAt: Timestamp.now(),
    });
    setImagenFile(null);
    setImagenPreview(null);
  };

  return (
    <div className="crear-actividad-page">
      <header className="crear-actividad-header">
        <div>
          <h2 className="crear-actividad-title">Crear Nueva Actividad</h2>
          <p className="crear-actividad-subtitle">
            Registra nuevas actividades vecinales con cupos y fechas específicas.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="crear-actividad-form" noValidate>
        {/* Columna izquierda */}
        <div className="form-col">
          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={actividad.titulo}
              onChange={handleChange}
              placeholder="Ej: Taller de Compostaje Familiar"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={6}
              value={actividad.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente la actividad..."
              maxLength={MAX_DESC}
              required
            />
            <div className="meta-row">
              <small className="help">Máx. {MAX_DESC} caracteres</small>
              <small
                className={`counter ${
                  descRest < 0 ? "invalid" : descRest < 60 ? "warn" : ""
                }`}
              >
                {descRest}
              </small>
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                value={actividad.fecha}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="hora">Hora</label>
              <input
                id="hora"
                name="hora"
                type="time"
                value={actividad.hora}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="lugar">Lugar</label>
            <input
              id="lugar"
              name="lugar"
              type="text"
              value={actividad.lugar}
              onChange={handleChange}
              placeholder="Ej: Sede Social Mi Barrio"
              required
            />
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="cupoTotal">Cupos totales</label>
              <input
                id="cupoTotal"
                name="cupoTotal"
                type="number"
                value={actividad.cupoTotal}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="responsable">Responsable</label>
              <input
                id="responsable"
                name="responsable"
                type="text"
                value={actividad.responsable}
                onChange={handleChange}
                placeholder="Ej: Comité Ambiental"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={actividad.estado}
              onChange={handleChange}
            >
              <option value="Activo">Activo</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="form-col">
          <div className="card">
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={handleImagenChange} />
            {imagenPreview && (
              <img src={imagenPreview} alt="Portada" className="preview-img" />
            )}
          </div>

          <div className="cover-preview">
            {actividad.imagenUrl ? (
              <img
                src={actividad.imagenUrl}
                alt="Previsualización"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/900x500?text=Sin+previsualizaci%C3%B3n";
                }}
              />
            ) : (
              <div className="cover-placeholder">
                <span>Previsualización de imagen</span>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button
            type="submit"
            className="button--secondary"
            disabled={!formIsValid || subiendo}
          >
            {subiendo ? "Creando..." : "Crear actividad"}
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
