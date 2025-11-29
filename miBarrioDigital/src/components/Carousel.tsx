import { useEffect, useState } from "react";
import "../styles/Carousel.css";

export type Slide = {
  src: string;
  title?: string;
  text?: string;
};

export default function Carousel({
  slides,
  interval = 5000,
}: {
  slides: Slide[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  // Avanza automáticamente
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, interval);
    return () => clearInterval(id);
  }, [interval, total]);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  if (!total) return null;

  return (
    <div className="carousel">
      {/* Slides */}
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div className="slide" key={i}>
            <img src={s.src} alt={s.title || `Slide ${i + 1}`} />
            {(s.title || s.text) && (
              <div className="carousel-caption">
               {s.title && (
  <div className="carousel-caption">
    <h3>{s.title}</h3>
  </div>
)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flechas simples */}
      {total > 1 && (
        <>
          <button className="carousel-btn prev" onClick={prev}>
            ❮
          </button>
          <button className="carousel-btn next" onClick={next}>
            ❯
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
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
