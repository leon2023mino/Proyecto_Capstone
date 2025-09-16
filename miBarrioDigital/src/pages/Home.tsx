import { useEffect, useState } from "react";
import "../App.css";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

// --- Componente Carousel ---
type Slide = { src: string; title?: string; text?: string };

function Carousel({ slides, interval = 5000 }: { slides: Slide[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const goTo = (i: number) => setIndex((i + total) % total);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay
  useEffect(() => {
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [index, interval]);

  if (!total) return null;

  return (
    <div className="carousel" aria-roledescription="carousel">
      <img
        key={index}
        src={slides[index].src}
        alt={slides[index].title ?? `Slide ${index + 1}`}
        className="carousel-image"
      />

      {/* Leyenda opcional */}
      {(slides[index].title || slides[index].text) && (
        <div className="carousel-caption">
          {slides[index].title && <h3>{slides[index].title}</h3>}
          {slides[index].text && <p>{slides[index].text}</p>}
        </div>
      )}

      {/* Controles */}
      <button className="carousel-btn prev" onClick={prev} aria-label="Anterior">‹</button>
      <button className="carousel-btn next" onClick={next} aria-label="Siguiente">›</button>

      {/* Indicadores */}
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const slides: Slide[] = [
    { src: slide1, title: "Feria de Emprendedores", text: "Sábado 21, Plaza Central" },
    { src: slide2, title: "Operativo de Salud", text: "Vacunación y controles gratuitos" },
    { src: slide3, title: "Campeonato Barrial", text: "Inscripciones abiertas" },
  ];

  return (
    <div className="app">
    
      {/* Contenido principal */}
      <main className="main">
    
        {/* Carrusel de Noticias/Eventos */}
        <section className="home-section">
          <h3>Noticias y Eventos</h3>
          <Carousel slides={slides} interval={5000} />
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Mi Barrio Digital - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

