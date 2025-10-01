// src/pages/Home.tsx
import "../../styles/Home.css";
import Carousel from "../../components/Carousel";
import type { Slide } from "../../components/Carousel";

import slide1 from "../../assets/slide1.jpg";
import slide2 from "../../assets/slide2.jpg";
import slide3 from "../../assets/slide3.jpg";

export default function Home() {
  const slides: Slide[] = [
    {
      src: slide1,
      title: "Feria de Emprendedores",
      text: "Sábado 21, Plaza Central",
    },
    {
      src: slide2,
      title: "Operativo de Salud",
      text: "Vacunación y controles gratuitos",
    },
    {
      src: slide3,
      title: "Campeonato Barrial",
      text: "Inscripciones abiertas",
    },
  ];

  const proximos = [
    { fecha: "05 Oct", titulo: "Taller de reciclaje" },
    { fecha: "10 Oct", titulo: "Reunión Junta" },
    { fecha: "15 Oct", titulo: "Campeonato baby fútbol" },
  ];

  const noticias = [
    {
      titulo: "Nueva sede comunitaria",
      resumen: "Avances de obra y plazos de entrega",
      fecha: "29 Sep",
    },
    {
      titulo: "Becas deportivas",
      resumen: "Inscripciones abiertas hasta el 10/10",
      fecha: "27 Sep",
    },
    {
      titulo: "Operativo de vacunación",
      resumen: "Calendario de atención en barrio",
      fecha: "25 Sep",
    },
  ];

  return (
    <main className="home">
      {/* CARRUSEL */}
      <section className="section block">
        <h2 className="section-title">Noticias y eventos</h2>
        <Carousel slides={slides} interval={5000} />
      </section>

      {/* ACCESOS + LATERAL */}
      <section className="layout">
        <div className="grid">
          <a className="card quick" href="/reservas">
            <h3>Reservar espacio</h3>
            <p>Agenda la sede social, multicancha o sala de reuniones.</p>
          </a>
          <a className="card quick" href="/proyectos">
            <h3>Proyectos</h3>
            <p>Revisa iniciativas, apoya o propone ideas.</p>
          </a>
          <a className="card quick" href="/noticias">
            <h3>Noticias</h3>
            <p>Comunicados, actividades y operativos.</p>
          </a>
        </div>

        <aside className="aside">
          <div className="aside-card">
            <h4>Próximas actividades</h4>
            <ul>
              {proximos.map((e, i) => (
                <li key={i}>
                  <span className="tag">{e.fecha}</span>
                  <span>{e.titulo}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="aside-card">
            <h4>Avisos</h4>
            <ul className="bullets">
              <li>Entrega de kits de reciclaje esta semana.</li>
              <li>Actualiza tus datos en Registro.</li>
              <li>Nuevos horarios sede comunitaria.</li>
            </ul>
          </div>
        </aside>
      </section>

      {/* NOTICIAS RECIENTES */}
      <section className="section">
        <h2 className="section-title">Últimas noticias</h2>
        <div className="news-grid">
          {noticias.map((n, i) => (
            <article key={i} className="news-card">
              <header>
                <span className="pill">{n.fecha}</span>
                <h3>{n.titulo}</h3>
              </header>
              <p>{n.resumen}</p>
              <a className="link" href="/noticias">
                Leer más →
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
