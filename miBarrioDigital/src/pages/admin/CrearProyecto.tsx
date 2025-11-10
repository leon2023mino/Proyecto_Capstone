import { useState } from "react";
import "../../styles/CrearProyecto.css";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { resizeImage } from "../../components/noticias/ResizeImage"; // puedes reutilizarlo

const MAX_DESC = 800;
const isHttpUrl = (v: string) => /^https?:\/\/.+/i.test(v.trim());

type NuevoProyecto = {
  titulo: string;
  descripcion: string;
  estado: string;
  categoria: string;
  responsable: string;
  imagen: string;
  createdAt: Timestamp;
};

export default function CrearProyecto() {
  const [proyecto, setProyecto] = useState<NuevoProyecto>({
    titulo: "",
    descripcion: "",
    estado: "",
    categoria: "",
    responsable: "",
    imagen: "",
    createdAt: Timestamp.now(),
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const descRest = MAX_DESC - proyecto.descripcion.length;

  const imagenIsValid = !proyecto.imagen || isHttpUrl(proyecto.imagen);
  const formIsValid =
    proyecto.titulo.trim().length > 0 &&
    proyecto.descripcion.trim().length > 0 &&
    proyecto.descripcion.length <= MAX_DESC &&
    proyecto.estado.trim().length > 0 &&
    imagenIsValid;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProyecto((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIsValid) return;
    setSubiendo(true);

    let imagenFinal = proyecto.imagen.trim();

    if (imagenFile) {
      const resized = await resizeImage(imagenFile, 900, 600);
      imagenFinal = await uploadImage(
        resized,
        `proyectos/imagenes/${Date.now()}-${resized.name}`
      );
    }

    const payload = {
      titulo: proyecto.titulo.trim(),
      descripcion: proyecto.descripcion.trim(),
      estado: proyecto.estado.trim(),
      categoria: proyecto.categoria.trim() || null,
      responsable: proyecto.responsable.trim() || null,
      imagen: imagenFinal,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, "proyectos"), payload);
      alert("✅ Proyecto creado correctamente.");

      // Reiniciar formulario
      setProyecto({
        titulo: "",
        descripcion: "",
        estado: "",
        categoria: "",
        responsable: "",
        imagen: "",
        createdAt: Timestamp.now(),
      });
      setImagenFile(null);
      setImagenPreview(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error al crear el proyecto.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleReset = () => {
    setProyecto({
      titulo: "",
      descripcion: "",
      estado: "",
      categoria: "",
      responsable: "",
      imagen: "",
      createdAt: Timestamp.now(),
    });
    setImagenFile(null);
    setImagenPreview(null);
  };

  return (
    <div className="crear-proyecto-page">
      <header className="crear-proyecto-header">
        <div>
          <h2 className="crear-proyecto-title">Crear Nuevo Proyecto</h2>
          <p className="crear-proyecto-subtitle">
            Publica una nueva iniciativa comunitaria con su descripción, estado y categoría.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="crear-proyecto-form" noValidate>
        {/* Columna izquierda */}
        <div className="form-col">
          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={proyecto.titulo}
              onChange={handleChange}
              placeholder="Ej: Mejoramiento de la plaza central"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={6}
              value={proyecto.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente el proyecto y sus objetivos..."
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
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={proyecto.estado}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="En curso">En curso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="categoria">Categoría (opcional)</label>
              <input
                id="categoria"
                name="categoria"
                type="text"
                value={proyecto.categoria}
                onChange={handleChange}
                placeholder="Ej: Comunal, Ambiental, Cultural..."
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="responsable">Responsable (opcional)</label>
            <input
              id="responsable"
              name="responsable"
              type="text"
              value={proyecto.responsable}
              onChange={handleChange}
              placeholder="Ej: Junta de Vecinos, Comité Ambiental..."
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="form-col">
          <div className="card">
            <label>Imagen del Proyecto</label>
            <input type="file" accept="image/*" onChange={handleImagenChange} />
            {imagenPreview && (
              <img src={imagenPreview} alt="Vista previa" className="preview-img" />
            )}
          </div>

          <div className="cover-preview">
            {proyecto.imagen ? (
              <img
                src={proyecto.imagen}
                alt="Previsualización de imagen"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/900x500?text=Sin+imagen";
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
            {subiendo ? "Creando..." : "Crear proyecto"}
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
