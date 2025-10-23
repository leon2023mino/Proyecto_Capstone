import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Noticia } from "../../types/typeNoticia";

export default function VerNoticiaAdmin() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticia = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setNoticia({ id: snap.id, ...(snap.data() as Noticia) });
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
      {/* Portada */}
      {noticia.coverUrl && (
        <img
          src={noticia.coverUrl}
          alt={noticia.titulo}
          style={{ width: "100%", height: 320, objectFit: "cover" }}
        />
      )}

      {/* Contenido */}
      <div style={{ padding: "1.5rem" }}>
        <h2 style={{ color: "var(--brand-blue)", marginTop: 0 }}>
          {noticia.titulo}
        </h2>

        <p style={{ fontSize: "1rem", color: "var(--text)" }}>
          {noticia.contenido}
        </p>

        <div style={{ marginTop: "1rem" }}>
          {noticia.visibleDesde && (
            <p style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>
              📅 Visible desde: {noticia.visibleDesde.toString()}
            </p>
          )}
          {noticia.visibleHasta && (
            <p style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>
              📆 Visible hasta: {noticia.visibleHasta.toString()}
            </p>
          )}
          {noticia.publicadoPor && (
            <p style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>
              ✍️ Autor: {noticia.publicadoPor}
            </p>
          )}
          {noticia.createdAt && (
            <p style={{ color: "var(--text-muted)", fontSize: ".85rem" }}>
              🕓 Publicada:{" "}
              {typeof noticia.createdAt === "object" &&
              "toDate" in noticia.createdAt
                ? noticia.createdAt.toDate().toLocaleString()
                : String(noticia.createdAt)}
            </p>
          )}
        </div>

        {/* Galería */}
        {Array.isArray((noticia as any).galeriaUrls) &&
          (noticia as any).galeriaUrls.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h4>🖼️ Galería</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                {(noticia as any).galeriaUrls.map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt={`imagen-${i}`}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Botón volver */}
        <div style={{ marginTop: "2rem", textAlign: "right" }}>
          <NavLink to="/AdministrarNoticias">
            <button
              style={{
                background: "var(--brand-blue)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: ".6rem 1rem",
                cursor: "pointer",
              }}
            >
              ← Volver a noticias
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
