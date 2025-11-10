import "../../styles/Proyectos.css";
import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Proyecto } from "../../components/proyectos/getProyectos";

export default function ProyectosVer() {
  const { id } = useParams<{ id: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyecto = async () => {
      if (!id) return;
      try {
        const ref = doc(db, "proyectos", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
         setProyecto({ ...(snap.data() as Proyecto), id: snap.id });
        } else {
          console.warn("⚠️ No se encontró el proyecto con ese ID");
        }
      } catch (err) {
        console.error("Error al obtener el proyecto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProyecto();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando proyecto...</p>;
  }

  if (!proyecto) {
    return <p style={{ textAlign: "center" }}>No se encontró el proyecto.</p>;
  }

  return (
    <div className="proyectos-page">
      <article className="proyecto-detalle">
        {/* 🔹 Imagen principal */}
        {proyecto.imagen ? (
          <img
            src={proyecto.imagen}
            alt={proyecto.titulo}
            className="proyecto-imagen"
          />
        ) : (
          <div
            className="proyecto-imagen sin-imagen"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0f0f0",
              color: "#666",
              height: "300px",
              borderRadius: "8px",
            }}
          >
            Sin imagen disponible
          </div>
        )}

        {/* 🔹 Contenido principal */}
        <div className="proyecto-contenido">
          <h2>{proyecto.titulo}</h2>

          {proyecto.estado && (
            <span
              className={`estado estado-${proyecto.estado
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {proyecto.estado === "En curso"
                ? "🟢 En curso"
                : proyecto.estado === "Finalizado"
                ? "🔵 Finalizado"
                : "🟡 Pendiente"}
            </span>
          )}

          {proyecto.categoria && (
            <p className="proyecto-categoria">
              <strong>Categoría:</strong> {proyecto.categoria}
            </p>
          )}

          <p className="proyecto-desc">{proyecto.descripcion}</p>

          {proyecto.createdAt && (
            <small className="fecha-publicacion">
              Publicado:{" "}
              {proyecto.createdAt?.toDate
                ? proyecto.createdAt.toDate().toLocaleDateString()
                : ""}
            </small>
          )}
        </div>
      </article>

      {/* 🔹 Botón para volver */}
      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <NavLink to="/proyectos" className="btn-ver-mas">
          ← Volver a Proyectos
        </NavLink>
      </div>
    </div>
  );
}
