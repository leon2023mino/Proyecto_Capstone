import { useMemo, useState } from "react";
import "../../styles/CrearNoticia.css";
import {
  addDoc,
  collection,
  Timestamp /*, serverTimestamp*/,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { type NuevaNoticia } from "../../types/typeNuevaNoticia";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIsValid) return;

    // Guarda en UTC (Firestore maneja UTC). No restes manualmente 3 horas.
    const payload = {
      titulo: noticia.titulo.trim(),
      contenido: noticia.descripcion.trim(),
      createdAt: Timestamp.now(), // o serverTimestamp() si prefieres el reloj del servidor
      coverUrl: noticia.coverUrl.trim(),
      galeriaUrls,
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

  const handleReset = () =>
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
            <div className="field">
              <label htmlFor="coverUrl">Imagen de portada (URL)</label>
              <input
                id="coverUrl"
                name="coverUrl"
                type="url"
                value={noticia.coverUrl}
                onChange={handleChange}
                placeholder="https://…"
                className={!coverIsValid ? "invalid" : ""}
              />
              <small className="help">
                Usa una URL pública (https). Formato recomendado: JPG/PNG/WEBP.
              </small>
              {!coverIsValid && (
                <small className="error-text">
                  Ingresa una URL válida (http/https).
                </small>
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

          <div className="card">
            <div className="field">
              <label htmlFor="galeriaRaw">
                Galería (URLs separadas por coma)
              </label>
              <input
                id="galeriaRaw"
                name="galeriaRaw"
                type="text"
                value={noticia.galeriaRaw}
                onChange={handleChange}
                placeholder="https://img1.jpg, https://img2.jpg, …"
                className={!galeriaAllValid ? "invalid" : ""}
              />
              <small className="help">
                Agrega varias imágenes separadas por coma (https).
              </small>
              {!galeriaAllValid && (
                <small className="error-text">
                  Una o más URLs no parecen válidas (deben iniciar con
                  http/https).
                </small>
              )}
            </div>

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
