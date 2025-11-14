import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../../styles/CrearEspacio.css";
import { resizeImage } from "../../components/noticias/ResizeImage";

type NuevoEspacio = {
  nombre: string;
  tipo: string;
  aforo: number | "";
  ubicacion: string;
  activo: boolean;
  imagen: string;
  createdAt: Timestamp;
};

export default function CrearEspacio() {
  const [espacio, setEspacio] = useState<NuevoEspacio>({
    nombre: "",
    tipo: "",
    aforo: "",
    ubicacion: "",
    activo: true,
    imagen: "",
    createdAt: Timestamp.now(),
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // 🔍 Validación básica
  const validar = () => {
    const e: Record<string, string> = {};
    if (!espacio.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!espacio.tipo.trim()) e.tipo = "Debes elegir un tipo.";
    if (espacio.aforo === "" || espacio.aforo <= 0)
      e.aforo = "El aforo debe ser mayor a 0.";
    if (!espacio.ubicacion.trim()) e.ubicacion = "La ubicación es obligatoria.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // 📤 Subida a Firebase Storage
  const uploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // 📌 Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!validar()) return;

    setEnviando(true);

    try {
      let imagenFinal = espacio.imagen.trim();

      if (imagenFile) {
        const resized = await resizeImage(imagenFile, 900, 600);
        imagenFinal = await uploadImage(
          resized,
          `espacios/imagenes/${Date.now()}-${resized.name}`
        );
      }

      const payload = {
        nombre: espacio.nombre.trim(),
        tipo: espacio.tipo.trim(),
        aforo: Number(espacio.aforo),
        ubicacion: espacio.ubicacion.trim(),
        activo: espacio.activo,
        imagen: imagenFinal,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "spaces"), payload);

      setMensaje("✅ Espacio creado correctamente.");

      // Reset
      setEspacio({
        nombre: "",
        tipo: "",
        aforo: "",
        ubicacion: "",
        activo: true,
        imagen: "",
        createdAt: Timestamp.now(),
      });
      setImagenFile(null);
      setPreview(null);

    } catch (error) {
      console.error("Error creando espacio:", error);
      setMensaje("❌ Error al crear el espacio.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="crear-espacio-page">
      <header className="crear-espacio-header">
        <h2>Crear Nuevo Espacio</h2>
        <p>Registra un espacio donde los vecinos podrán hacer reservas.</p>
      </header>

      <form onSubmit={handleSubmit} className="crear-espacio-form" noValidate>
        {/* NOMBRE */}
        <div className={`form-field ${errores.nombre ? "error" : ""}`}>
          <label>Nombre del espacio *</label>
          <input
            name="nombre"
            value={espacio.nombre}
            onChange={(e) =>
              setEspacio({ ...espacio, nombre: e.target.value })
            }
            placeholder="Ej: Sala Multiuso"
          />
          {errores.nombre && <small className="error-text">{errores.nombre}</small>}
        </div>

        {/* TIPO */}
        <div className={`form-field ${errores.tipo ? "error" : ""}`}>
          <label>Tipo *</label>
          <select
            name="tipo"
            value={espacio.tipo}
            onChange={(e) =>
              setEspacio({ ...espacio, tipo: e.target.value })
            }
          >
            <option value="">Selecciona tipo...</option>
            <option value="Sala">Sala</option>
            <option value="Cancha">Cancha</option>
            <option value="Sede Social">Sede Social</option>
            <option value="Otro">Otro</option>
          </select>
          {errores.tipo && <small className="error-text">{errores.tipo}</small>}
        </div>

        {/* AFORO */}
        <div className={`form-field ${errores.aforo ? "error" : ""}`}>
          <label>Aforo máximo *</label>
          <input
            type="number"
            min={1}
            name="aforo"
            value={espacio.aforo}
            onChange={(e) =>
              setEspacio({ ...espacio, aforo: Number(e.target.value) })
            }
            placeholder="Ej: 50"
          />
          {errores.aforo && <small className="error-text">{errores.aforo}</small>}
        </div>

        {/* UBICACIÓN */}
        <div className={`form-field ${errores.ubicacion ? "error" : ""}`}>
          <label>Ubicación *</label>
          <input
            name="ubicacion"
            value={espacio.ubicacion}
            onChange={(e) =>
              setEspacio({ ...espacio, ubicacion: e.target.value })
            }
            placeholder="Ej: Calle Los Robles 123"
          />
          {errores.ubicacion && (
            <small className="error-text">{errores.ubicacion}</small>
          )}
        </div>

        {/* IMAGEN */}
        <div className="form-field">
          <label>Imagen del espacio (opcional)</label>
          <input type="file" accept="image/*" onChange={handleImagen} />

          {preview ? (
            <img className="preview-img" src={preview} alt="Vista previa" />
          ) : espacio.imagen ? (
            <img className="preview-img" src={espacio.imagen} alt="Preview" />
          ) : (
            <div className="cover-placeholder">Sin imagen seleccionada</div>
          )}
        </div>

        {/* ACTIVO */}
        <div className="form-check">
          <input
            type="checkbox"
            id="activo"
            checked={espacio.activo}
            onChange={(e) =>
              setEspacio({ ...espacio, activo: e.target.checked })
            }
          />
          <label htmlFor="activo">Espacio activo</label>
        </div>

        {mensaje && <div className="mensaje">{mensaje}</div>}

        <div className="acciones">
          <button type="submit" className="btn-admin-blue" disabled={enviando}>
            {enviando ? "Creando..." : "Crear Espacio"}
          </button>
        </div>
      </form>
    </div>
  );
}
