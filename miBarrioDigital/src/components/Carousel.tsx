import { useEffect, useState } from "react";
import "../App.css"; // o "../styles/Carousel.css" si prefieres separarlo

export type Slide = { src: string; title?: string; text?: string };

export default function Carousel({
  slides,
  interval = 5000,
}: {
  slides: Slide[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const total = slides.length;

  const goTo = (i: number) => setIndex((i + total) % total);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay pausado al hover
  useEffect(() => {
    if (total <= 1 || isHovering) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), interval);
    return () => clearInterval(id);
  }, [interval, total, isHovering]);

  if (!total) return null;

  return (
    <div
      className="carousel"
      aria-roledescription="carousel"
      aria-label="Carrusel de noticias y eventos"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
    >
      {/* Viewport que recorta y pista que se desliza */}
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div className="slide" key={i}>
              <img
                src={s.src}
                alt={s.title ?? `Slide ${i + 1}`}
                loading="lazy"
              />
              {(s.title || s.text) && (
                <div className="carousel-caption">
                  {s.title && <h3>{s.title}</h3>}
                  {s.text && <p>{s.text}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Flechas */}
      {total > 1 && (
        <>
          <button className="carousel-btn prev" onClick={prev} aria-label="Anterior">
            {/* Chevron izquierdo SVG */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 19a1 1 0 0 1-.7-.29l-6-6a1 1 0 0 1 0-1.42l6-6a1 1 0 1 1 1.41 1.42L10.91 12l5.3 5.29A1 1 0 0 1 15.5 19z"/>
            </svg>
          </button>
          <button className="carousel-btn next" onClick={next} aria-label="Siguiente">
            {/* Chevron derecho SVG */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.5 19a1 1 0 0 1-.71-1.71L13.09 12 7.79 6.71A1 1 0 1 1 9.2 5.29l6 6a1 1 0 0 1 0 1.42l-6 6A1 1 0 0 1 8.5 19z"/>
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
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
      )}
    </div>
  );
}