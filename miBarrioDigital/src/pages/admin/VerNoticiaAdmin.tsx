import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Noticia } from "../../types/typeNoticia";
import "../../styles/VerNoticiaAdmin.css";

export default function VerNoticiaAdmin() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [publicadoPor, setPublicadoPor] = useState("");
  const [visibleDesdeStr, setVisibleDesdeStr] = useState("");
  const [visibleHastaStr, setVisibleHastaStr] = useState("");

  const toInputDateTime = (v: any) => {
    if (!v) return "";
    const d = typeof v.toDate === "function" ? v.toDate() : new Date(v);
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchNoticia = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
         const n: Noticia = { ...(data as Noticia), id: snap.id };
          setNoticia(n);
          setTitulo(String(data.titulo ?? ""));
          setContenido(String(data.contenido ?? ""));
          setCoverUrl(String(data.coverUrl ?? ""));
          setPublicadoPor(String(data.autor ?? data.publicadoPor ?? ""));
          setVisibleDesdeStr(toInputDateTime(data.visibleDesde));
          setVisibleHastaStr(toInputDateTime(data.visibleHasta));
        }
      } catch (err) {
        console.error("Error al obtener noticia:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticia();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setMessage(null);
    try {
      const ref = doc(db, "posts", id);
      const updates: any = {
        titulo,
        contenido,
        coverUrl,
        autor: publicadoPor || null,
        visibleDesde: visibleDesdeStr ? new Date(visibleDesdeStr) : null,
        visibleHasta: visibleHastaStr ? new Date(visibleHastaStr) : null,
        updatedAt: new Date(),
      };
      await updateDoc(ref, updates);
      setMessage("Cambios guardados correctamente.");
      setNoticia((prev) => (prev ? { ...prev, ...updates } : prev));
    } catch (err) {
      console.error("Error guardando noticia:", err);
      setMessage("Error al guardar los cambios.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando noticia...</p>;
  if (!noticia)
    return <p style={{ textAlign: "center" }}>No se encontró la noticia.</p>;

  return (
    <div className="ver-noticia-admin">
      {coverUrl && (
        <img src={coverUrl} alt={titulo || noticia.titulo} className="portada" />
      )}

      <div className="noticia-admin-content">
        <h2>Editar noticia</h2>

        <div className="field">
          <label>Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="field">
          <label>Contenido</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={6}
          />
        </div>

        <div className="field">
          <label>URL de portada</label>
          <input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="field">
          <label>Autor / Publicado por</label>
          <input
            value={publicadoPor}
            onChange={(e) => setPublicadoPor(e.target.value)}
          />
        </div>

        <div className="field-group">
          <div className="field">
            <label>Visible desde</label>
            <input
              type="datetime-local"
              value={visibleDesdeStr}
              onChange={(e) => setVisibleDesdeStr(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Visible hasta</label>
            <input
              type="datetime-local"
              value={visibleHastaStr}
              onChange={(e) => setVisibleHastaStr(e.target.value)}
            />
          </div>
        </div>

        <div className="actions">
          <div className="actions-left">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <NavLink to="/admin/AdministrarNoticias">
              <button className="btn-secondary">← Volver</button>
            </NavLink>
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
