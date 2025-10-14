import { NavLink } from "react-router";
import "../../styles/Noticias.css";

// ✅ Import imágenes desde assets
import noticia1 from "../../assets/noticia1.avif";
import noticia2 from "../../assets/noticia2.jpg";
import noticia3 from "../../assets/noticia3.jpg";

type Noticia = {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  imagen?: string;
  fechaCreacion: string;
  visibleDesde: string;
  visibleHasta: string;
  autor: string;
};

export default function Noticias() {
  const noticias: Noticia[] = [
    {
      id: 1,
      titulo: "Nueva sede comunitaria en construcción",
      fecha: "10 Septiembre 2025",
      descripcion:
        "Comenzaron las obras para la nueva sede social que estará lista en diciembre. Un espacio para reuniones, talleres y actividades del barrio.",
      imagen: noticia1,
      fechaCreacion: "2 de octubre de 2025",
      visibleDesde: "1 de octubre de 2025",
      visibleHasta: "1 de enero de 2026",
      autor: "leo minion",
    },
    {
      id: 2,
      titulo: "Operativo de limpieza barrial",
      fecha: "25 Agosto 2025",
      descripcion:
        "Vecinos se unieron en una jornada de limpieza y reciclaje en la plaza central. ¡Gracias a todos los participantes!",
      imagen: noticia2,
      fechaCreacion: "2 de octubre de 2025",
      visibleDesde: "1 de octubre de 2025",
      visibleHasta: "1 de enero de 2026",
      autor: "leo minion",
    },
    {
      id: 3,
      titulo: "Campeonato de baby fútbol",
      fecha: "15 Agosto 2025",
      descripcion:
        "Se abre la inscripción para el campeonato anual. Equipos de 5 integrantes, categorías juveniles y adultos.",
      imagen: noticia3,
      fechaCreacion: "2 de octubre de 2025",
      visibleDesde: "1 de octubre de 2025",
      visibleHasta: "1 de enero de 2026",
      autor: "leo minion",
    },
  ];

  return (
    <div className="noticias-page">
      <h2>Noticias del Barrio</h2>
      <p>Mantente informado sobre lo que ocurre en tu comunidad.</p>

      <div className="noticias-lista">
        {noticias.map((n) => (
          <article key={n.id} className="noticia-card">
            {n.imagen && <img src={n.imagen} alt={n.titulo} />}
            <div className="noticia-contenido">
              <h3>{n.titulo}</h3>
              <span className="noticia-fecha">{n.fecha}</span>
              <p>{n.descripcion}</p>
              <NavLink to="/NoticiasVer" className="btn-leer-mas">
                Leer más
              </NavLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
