import { useState } from "react";
import "../../styles/CrearNoticia.css";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { type NuevaNoticia } from "../../types/typeNuevaNoticia";
import { resizeImage } from "../../components/noticias/ResizeImage";

const MAX_DESC = 600;
const isHttpUrl = (v: string) => /^https?:\/\/.+/i.test(v.trim());

export default function CrearNoticia() {
  const [noticia, setNoticia] = useState<NuevaNoticia>({
    titulo: "",
    descripcion: "",
    createdAt: Timestamp.now(),
    coverUrl: "",
    visibleDesde: "",
    visibleHasta: "",
    autor: "",
    galeriaRaw: "", // lo mantenemos en el tipo, pero no se usa
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const descRest = MAX_DESC - noticia.descripcion.length;

  const coverIsValid = !noticia.coverUrl || isHttpUrl(noticia.coverUrl);
  const fechasValidas =
    !noticia.visibleDesde ||
    !noticia.visibleHasta ||
    new Date(noticia.visibleDesde) <= new Date(noticia.visibleHasta);

  const formIsValid =
    noticia.titulo.trim().length > 0 &&
    noticia.descripcion.trim().length > 0 &&
    noticia.descripcion.length <= MAX_DESC &&
    coverIsValid &&
    fechasValidas;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNoticia((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
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

    let coverUrlFinal = noticia.coverUrl.trim();

    if (coverFile) {
      const resized = await resizeImage(coverFile, 900, 600);
      coverUrlFinal = await uploadImage(
        resized,
        `noticias/portadas/${Date.now()}-${resized.name}`
      );
    }

    const payload = {
      titulo: noticia.titulo.trim(),
      contenido: noticia.descripcion.trim(),
      createdAt: Timestamp.now(),
      coverUrl: coverUrlFinal,
      visibleDesde: noticia.visibleDesde || null,
      visibleHasta: noticia.visibleHasta || null,
      autor: noticia.autor.trim() || null,
    };

    try {
      await addDoc(collection(db, "posts"), payload);
      alert("✅ Noticia creada correctamente.");

      setNoticia({
        titulo: "",
        descripcion: "",
        createdAt: Timestamp.now(),
        coverUrl: "",
        visibleDesde: "",
        visibleHasta: "",
        autor: "",
        galeriaRaw: "",
      });
      setCoverFile(null);
      setCoverPreview(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error al crear la noticia.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleReset = () => {
    setNoticia({
      titulo: "",
      descripcion: "",
      createdAt: Timestamp.now(),
      coverUrl: "",
      visibleDesde: "",
      visibleHasta: "",
      autor: "",
      galeriaRaw: "",
    });
    setCoverFile(null);
    setCoverPreview(null);
  };

  return (
    <div className="crear-noticia-page">
      <header className="crear-noticia-header">
        <div>
          <h2 className="crear-noticia-title">Crear Nueva Noticia</h2>
          <p className="crear-noticia-subtitle">
            Publica novedades para la comunidad. Completa los campos y revisa la
            previsualización de la portada.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="crear-noticia-form" noValidate>
        {/* Columna izquierda */}
        <div className="form-col">
          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={noticia.titulo}
              onChange={handleChange}
              placeholder="Ej: Nueva sede comunitaria en construcción"
              required
            />
            <small className="help">Un título claro y directo.</small>
          </div>

          <div className="field">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={6}
              value={noticia.descripcion}
              onChange={handleChange}
              placeholder="Describe la noticia de forma breve y amigable…"
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
              <label htmlFor="visibleDesde">Visible desde (opcional)</label>
              <input
                id="visibleDesde"
                name="visibleDesde"
                type="date"
                value={noticia.visibleDesde}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="visibleHasta">Visible hasta (opcional)</label>
              <input
                id="visibleHasta"
                name="visibleHasta"
                type="date"
                value={noticia.visibleHasta}
                onChange={handleChange}
              />
            </div>
          </div>
          {!fechasValidas && (
            <div className="inline-alert error">
              La fecha “Visible hasta” debe ser igual o posterior a “Visible
              desde”.
            </div>
          )}

          <div className="field">
            <label htmlFor="autor">Autor (opcional)</label>
            <input
              id="autor"
              name="autor"
              type="text"
              value={noticia.autor}
              onChange={handleChange}
              placeholder="Ej: Junta de Vecinos Mi Barrio Digital"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="form-col">
          <div className="card">
            <label>Portada</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} />
            {coverPreview && (
              <img src={coverPreview} alt="Portada" className="preview-img" />
            )}
          </div>

          <div className="cover-preview">
            {noticia.coverUrl ? (
              <img
                src={noticia.coverUrl}
                alt="Previsualización de portada"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/900x500?text=Sin+previsualizaci%C3%B3n";
                }}
              />
            ) : (
              <div className="cover-placeholder">
                <span>Previsualización de portada</span>
              </div>
            )}
          </div>
        </div>

        {/* acciones */}
        <div className="form-actions">
          <button
            type="submit"
            className="button--secondary"
            disabled={!formIsValid || subiendo}
          >
            {subiendo ? "Creando..." : "Crear noticia"}
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
