import "../styles/Proyectos.css";

type Estado = "En curso" | "Finalizado" | "Pendiente";

type Proyecto = {
  id: number;
  titulo: string;
  estado: Estado;
  descripcion: string;
  imagen?: string; // si usas /public/proyectoX.jpg, deja la ruta absoluta. Si es de src/assets, impórtala.
};

export default function Proyectos() {
  const proyectos: Proyecto[] = [
    {
      id: 1,
      titulo: "Plaza con Juegos Infantiles",
      estado: "En curso",
      descripcion:
        "Proyecto aprobado para instalar juegos infantiles y máquinas de ejercicio en la plaza central.",
      imagen: "/proyecto1.jpg", // o import img1 from "../assets/proyecto1.jpg";
    },
    {
      id: 2,
      titulo: "Murales Comunitarios",
      estado: "Finalizado",
      descripcion:
        "Vecinos artistas pintaron murales que representan la historia del barrio.",
      imagen: "/proyecto2.jpg",
    },
    {
      id: 3,
      titulo: "Huerto Comunitario",
      estado: "Pendiente",
      descripcion:
        "Propuesta para cultivar frutas y verduras en un terreno baldío.",
      imagen: "/proyecto3.jpg",
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
            Revisa iniciativas en curso, finalizadas o en postulación dentro de la comunidad.
          </p>
        </div>

        {/* Opcional: toolbar de búsqueda/filtro */}
        <div className="proyectos-toolbar">
          <input className="input-search" type="search" placeholder="Buscar proyecto..." />
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
              <span className={estadoClass(p.estado)}>
                {/* Icono simple por estado */}
                {p.estado === "En curso" && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="5" />
                  </svg>
                )}
                {p.estado === "Finalizado" && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
                {p.estado === "Pendiente" && (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 7v5l3 3" />
                  </svg>
                )}
                {p.estado}
              </span>

              <p className="proyecto-desc">{p.descripcion}</p>

              <div className="proyecto-actions">
                <button className="btn-ver-mas">Ver más</button>
                <button className="btn-ghost">Apoyar</button>
              </div>
            </div>

            {/* Meta/chips (opcional) */}
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