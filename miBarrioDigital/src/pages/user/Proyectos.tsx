import "../../styles/Proyectos.css";
import { NavLink } from "react-router-dom";

// ✅ Importa las imágenes desde src/assets
import img1 from "../../assets/proyecto1.jpg";
import img2 from "../../assets/proyecto2.jpg";
import img3 from "../../assets/proyecto3.webp";

type Estado = "En curso" | "Finalizado" | "Pendiente";

type Proyecto = {
  id: number;
  titulo: string;
  estado: Estado;
  descripcion: string;
  imagen?: string;
};

export default function Proyectos() {
  const proyectos: Proyecto[] = [
    {
      id: 1,
      titulo: "Plaza con Juegos Infantiles",
      estado: "En curso",
      descripcion:
        "Proyecto aprobado para instalar juegos infantiles y máquinas de ejercicio en la plaza central.",
      imagen: img1, // 👈 ahora usa la importación
    },
    {
      id: 2,
      titulo: "Murales Comunitarios",
      estado: "Finalizado",
      descripcion:
        "Vecinos artistas pintaron murales que representan la historia del barrio.",
      imagen: img2,
    },
    {
      id: 3,
      titulo: "Huerto Comunitario",
      estado: "Pendiente",
      descripcion:
        "Propuesta para cultivar frutas y verduras en un terreno baldío.",
      imagen: img3,
    },
  ];

  const estadoClass = (e: Estado) =>
    `estado estado-${e.toLowerCase().replace(" ", "-")}`;

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

        {/* Opcional: toolbar de búsqueda/filtro */}
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

      <div className="proyectos-lista">
        {proyectos.map((p) => (
          <article key={p.id} className="proyecto-card">
            {/* Imagen */}
            {p.imagen ? (
              <img className="proyecto-thumb" src={p.imagen} alt={p.titulo} />
            ) : (
              <div className="proyecto-thumb" aria-hidden="true" />
            )}

            {/* Contenido */}
            <div className="proyecto-body">
              <h3>{p.titulo}</h3>
              <span className={estadoClass(p.estado)}>{p.estado}</span>
              <p className="proyecto-desc">{p.descripcion}</p>

              <div className="proyecto-actions">
                <NavLink to="/ProyectosVer" className="btn-ver-mas">
                  Ver más
                </NavLink>
                <button className="btn-ghost">Apoyar</button>
              </div>
            </div>

            {/* Meta/chips */}
            <div className="proyecto-meta">
              <span className="meta-chip">Comunal</span>
              <span className="meta-chip">Participativo</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}