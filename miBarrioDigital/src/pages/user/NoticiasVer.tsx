import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/Noticias.css";
import { type Noticia } from "../../types/typeNoticia";

export default function NoticiasVer() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchNoticia = async () => {
      try {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setNoticia({ id: snap.id, ...(snap.data() as Noticia) });
        }
      } catch (error) {
        console.error("Error al obtener la noticia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando noticia...</p>;
  if (!noticia)
    return (
      <p style={{ textAlign: "center" }}>No se encontró la noticia solicitada.</p>
    );

  return (
    <div className="noticias-page">
      <article className="noticia-detalle">
        {noticia.coverUrl && (
          <img
            src={noticia.coverUrl}
            alt={noticia.titulo}
            className="noticia-imagen"
          />
        )}

        <div className="noticia-contenido">
          <h2>{noticia.titulo}</h2>
          <span className="noticia-fecha">
            {typeof noticia.createdAt === "object" &&
            "toDate" in noticia.createdAt
              ? noticia.createdAt.toDate().toLocaleDateString()
              : String(noticia.createdAt)}
          </span>
          <p>{noticia.contenido}</p>

          {Array.isArray((noticia as any).galeriaUrls) &&
            (noticia as any).galeriaUrls.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <h4>Galería</h4>
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
        </div>
      </article>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <NavLink to="/noticias" className="btn-leer-mas">
          ← Volver a Noticias
        </NavLink>
      </div>
    </div>
  );
}
