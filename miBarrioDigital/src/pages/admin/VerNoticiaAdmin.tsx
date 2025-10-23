import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Noticia } from "../../types/typeNoticia";

export default function VerNoticiaAdmin() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // form fields
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [galeria, setGaleria] = useState(""); // coma-separado
  const [publicadoPor, setPublicadoPor] = useState("");
  const [visibleDesdeStr, setVisibleDesdeStr] = useState(""); // datetime-local
  const [visibleHastaStr, setVisibleHastaStr] = useState("");

  const toInputDateTime = (v: any) => {
    if (!v) return "";
    const d = typeof v.toDate === "function" ? v.toDate() : new Date(v);
    return d.toISOString().slice(0, 16); // yyyy-mm-ddThh:mm for datetime-local
  };

  useEffect(() => {
    const fetchNoticia = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          const n: Noticia = { id: snap.id, ...(data as Noticia) };
          setNoticia(n);

          // inicializar formulario
          setTitulo(String(data.titulo ?? ""));
          setContenido(String(data.contenido ?? data.Contenido ?? ""));
          setCoverUrl(String(data.coverUrl ?? ""));
          setGaleria(
            Array.isArray(data.galeriaUrls) ? data.galeriaUrls.join(", ") : ""
          );
          setPublicadoPor(String(data.publicadoPor ?? ""));
          setVisibleDesdeStr(toInputDateTime(data.visibleDesde));
          setVisibleHastaStr(toInputDateTime(data.visibleHasta));
        } else {
          console.warn("⚠️ No se encontró la noticia con ese ID");
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
        titulo: titulo || null,
        contenido: contenido || null,
        coverUrl: coverUrl || null,
        galeriaUrls: galeria
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        publicadoPor: publicadoPor || null,
        visibleDesde: visibleDesdeStr ? new Date(visibleDesdeStr) : null,
        visibleHasta: visibleHastaStr ? new Date(visibleHastaStr) : null,
        updatedAt: new Date(),
      };
      await updateDoc(ref, updates);
      setMessage("Cambios guardados.");
      // actualizar estado local
      setNoticia((prev) => (prev ? { ...prev, ...updates } : prev));
    } catch (err) {
      console.error("Error guardando noticia:", err);
      setMessage("Error al guardar. Revisa la consola.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando noticia...</p>;
  }

  if (!noticia) {
    return <p style={{ textAlign: "center" }}>No se encontró la noticia.</p>;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "var(--shadow)",
        overflow: "hidden",
      }}
    >
      {/* Portada (previa) */}
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={titulo || noticia.titulo}
          style={{ width: "100%", height: 320, objectFit: "cover" }}
        />
      ) : noticia.coverUrl ? (
        <img
          src={noticia.coverUrl}
          alt={noticia.titulo}
          style={{ width: "100%", height: 320, objectFit: "cover" }}
        />
      ) : null}

      {/* Formulario de edición */}
      <div style={{ padding: "1.5rem" }}>
        <h2 style={{ color: "var(--brand-blue)", marginTop: 0 }}>
          Editar noticia
        </h2>

        <label style={{ display: "block", marginBottom: 8 }}>
          Título
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Contenido
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          URL de portada
          <input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://..."
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Galería (separadas por coma)
          <input
            value={galeria}
            onChange={(e) => setGaleria(e.target.value)}
            placeholder="https://..., https://..."
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Autor / Publicado por
          <input
            value={publicadoPor}
            onChange={(e) => setPublicadoPor(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <label style={{ flex: 1 }}>
            Visible desde
            <input
              type="datetime-local"
              value={visibleDesdeStr}
              onChange={(e) => setVisibleDesdeStr(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          <label style={{ flex: 1 }}>
            Visible hasta
            <input
              type="datetime-local"
              value={visibleHastaStr}
              onChange={(e) => setVisibleHastaStr(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: 8,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: "var(--brand-blue)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: ".6rem 1rem",
                cursor: "pointer",
              }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <NavLink to="/AdministrarNoticias" style={{ marginLeft: 8 }}>
              <button
                style={{
                  background: "#eee",
                  color: "#222",
                  border: "none",
                  borderRadius: "8px",
                  padding: ".6rem 1rem",
                  cursor: "pointer",
                }}
              >
                ← Volver
              </button>
            </NavLink>
          </div>

          <div
            style={{
              color: message?.startsWith("Error") ? "crimson" : "green",
            }}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
