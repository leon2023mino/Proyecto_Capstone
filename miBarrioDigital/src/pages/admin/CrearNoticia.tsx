import { useMemo, useState } from "react";
import "../../styles/CrearNoticia.css";
import {
  addDoc,
  collection,
  Timestamp /*, serverTimestamp*/,
} from "firebase/firestore";
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
    galeriaRaw: "",
    visibleDesde: "",
    visibleHasta: "",
    autor: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState<string[]>([]);
  const [subiendo, setSubiendo] = useState(false);

  const descRest = MAX_DESC - noticia.descripcion.length;

  const galeriaUrls = useMemo(
    () =>
      noticia.galeriaRaw
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean),
    [noticia.galeriaRaw]
  );

  const coverIsValid = !noticia.coverUrl || isHttpUrl(noticia.coverUrl);
  const galeriaAllValid =
    galeriaUrls.length === 0 || galeriaUrls.every((u) => isHttpUrl(u));

  const fechasValidas = useMemo(() => {
    if (!noticia.visibleDesde || !noticia.visibleHasta) return true;
    return new Date(noticia.visibleDesde) <= new Date(noticia.visibleHasta);
  }, [noticia.visibleDesde, noticia.visibleHasta]);

  const formIsValid =
    noticia.titulo.trim().length > 0 &&
    noticia.descripcion.trim().length > 0 &&
    noticia.descripcion.length <= MAX_DESC &&
    coverIsValid &&
    galeriaAllValid &&
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

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGaleriaFiles(files);
    setGaleriaPreviews(files.map((f) => URL.createObjectURL(f)));
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

    // 🔹 Subir galería (si hay archivos)
    const galeriaUrlsFinal: string[] = [];
    for (const file of galeriaFiles) {
      const resized = await resizeImage(file, 900, 600);
      const url = await uploadImage(
        resized,
        `noticias/galeria/${Date.now()}-${resized.name}`
      );
      galeriaUrlsFinal.push(url);
    }

    const galeriaCombinada = [
      ...galeriaUrlsFinal,
      ...galeriaUrls.filter((u) => isHttpUrl(u)),
    ];

    // Guarda en UTC (Firestore maneja UTC). No restes manualmente 3 horas.
    const payload = {
      titulo: noticia.titulo.trim(),
      contenido: noticia.descripcion.trim(),
      createdAt: Timestamp.now(), // o serverTimestamp() si prefieres el reloj del servidor
      coverUrl: coverUrlFinal,
      galeriaUrls: galeriaCombinada,
      visibleDesde: noticia.visibleDesde || null,
      visibleHasta: noticia.visibleHasta || null,
      autor: noticia.autor.trim() || null,
    };

    try {
      await addDoc(collection(db, "posts"), payload);
      alert("Noticia creada correctamente.");
      // Reset consistente (mantén el tipo de createdAt como Timestamp)
      setNoticia({
        titulo: "",
        descripcion: "",
        createdAt: Timestamp.now(),
        coverUrl: "",
        galeriaRaw: "",
        visibleDesde: "",
        visibleHasta: "",
        autor: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error al crear la noticia.");
    }
  };

  const handleReset = () => {
    setNoticia({
      titulo: "",
      descripcion: "",
      createdAt: Timestamp.now(),
      coverUrl: "",
      galeriaRaw: "",
      visibleDesde: "",
      visibleHasta: "",
      autor: "",
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
            <div className="form-col">
              <div className="card">
                <label>Portada</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Portada"
                    className="preview-img"
                  />
                )}
              </div>
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

          <div className="card">
            <label>Galería</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGaleriaChange}
            />

            {galeriaUrls.length > 0 && (
              <>
                <div className="chips">
                  {galeriaUrls.map((u, i) => (
                    <span key={i} className="chip" title={u}>
                      {u.length > 28 ? u.slice(0, 28) + "…" : u}
                    </span>
                  ))}
                </div>

                <div className="galeria-preview">
                  {galeriaUrls.slice(0, 6).map((u, i) => (
                    <img
                      key={i}
                      src={u}
                      alt={`Imagen ${i + 1}`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://via.placeholder.com/300x180?text=Sin+imagen";
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* acciones */}
        <div className="form-actions">
          <button
            type="submit"
            className="button--secondary"
            disabled={!formIsValid}
          >
            Crear noticia
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
