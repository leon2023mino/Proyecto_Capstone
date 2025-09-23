import "../styles/Proyectos.css";

type Proyecto = {
  id: number;
  titulo: string;
  estado: "En curso" | "Finalizado" | "Pendiente";
  descripcion: string;
  imagen?: string;
};

export default function Proyectos() {
  const proyectos: Proyecto[] = [
    {
      id: 1,
      titulo: "Plaza con Juegos Infantiles",
      estado: "En curso",
      descripcion: "Proyecto aprobado por la municipalidad para instalar juegos infantiles y máquinas de ejercicio en la plaza central.",
      imagen: "/proyecto1.jpg"
    },
    {
      id: 2,
      titulo: "Murales Comunitarios",
      estado: "Finalizado",
      descripcion: "Vecinos artistas pintaron murales que representan la historia del barrio.",
      imagen: "/proyecto2.jpg"
    },
    {
      id: 3,
      titulo: "Huerto Comunitario",
      estado: "Pendiente",
      descripcion: "Propuesta presentada por vecinos para cultivar frutas y verduras en un terreno baldío.",
      imagen: "/proyecto3.jpg"
    }
  ];

  return (
    <div className="proyectos-page">
      <h2>Proyectos Comunitarios</h2>
      <p>Aquí podrás ver los proyectos en curso, terminados o en postulación dentro de la comunidad.</p>

      <div className="proyectos-lista">
        {proyectos.map((p) => (
          <div key={p.id} className="proyecto-card">
            {p.imagen && <img src={p.imagen} alt={p.titulo} />}
            <div className="proyecto-contenido">
              <h3>{p.titulo}</h3>
              <span className={`estado estado-${p.estado.toLowerCase().replace(" ", "-")}`}>
                {p.estado}
              </span>
              <p>{p.descripcion}</p>
              <button className="btn-ver-mas">Ver más</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}