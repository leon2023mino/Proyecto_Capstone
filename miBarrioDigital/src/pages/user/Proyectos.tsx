import "../../styles/Proyectos.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// 🔹 Tipo de proyecto
export type Proyecto = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  imagen?: string;
  categoria?: string;
  createdAt?: any;
};

export default function Proyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Escucha en tiempo real de la colección "proyectos"
  useEffect(() => {
    const q = query(collection(db, "proyectos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as DocumentData),
      })) as Proyecto[];
      setProyectos(docs);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔹 Clase visual del estado
  const estadoClass = (e: string) =>
    `estado estado-${e.toLowerCase().replace(" ", "-")}`;

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando proyectos...</p>;
  }

  return (
    <div className="proyectos-page">
      <div className="proyectos-header">
        <div>
          <h2 className="proyectos-title">Proyectos Comunitarios</h2>
          <p className="proyectos-subtitle">
            Revisa iniciativas en curso, finalizadas o en postulación dentro de
            la comunidad.
          </p>
        </div>

        <div className="proyectos-toolbar">
          <input
            className="input-search"
            type="search"
            placeholder="Buscar proyecto..."
          />
          <select className="select-filter" defaultValue="">
            <option value="">Todos</option>
            <option value="En curso">En curso</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      {proyectos.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          No hay proyectos registrados.
        </p>
      ) : (
        <div className="proyectos-lista">
          {proyectos.map((p) => (
            <article key={p.id} className="proyecto-card">
              {/* 🔹 Imagen */}
              {p.imagen ? (
                <img className="proyecto-thumb" src={p.imagen} alt={p.titulo} />
              ) : (
                <div className="proyecto-thumb sin-imagen">Sin imagen</div>
              )}

              {/* 🔹 Contenido */}
              <div className="proyecto-body">
                <h3>{p.titulo}</h3>
                {p.estado && (
                  <span className={estadoClass(p.estado)}>{p.estado}</span>
                )}
                <p className="proyecto-desc">{p.descripcion}</p>

                {/* 🔹 Fecha si existe */}
                {p.createdAt && (
                  <small className="fecha-publicacion">
                    Publicado:{" "}
                    {p.createdAt?.toDate
                      ? p.createdAt.toDate().toLocaleDateString()
                      : ""}
                  </small>
                )}

                <div className="proyecto-actions">
                  <NavLink to={`/ProyectosVer/${p.id}`} className="btn-ver-mas">
                    Ver más
                  </NavLink>
                </div>
              </div>

              {/* 🔹 Categoría */}
              {p.categoria && (
                <div className="proyecto-meta">
                  <span className="meta-chip">{p.categoria}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
