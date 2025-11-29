import { useEffect, useState } from "react";
import "../../styles/Home.css";
import Carousel from "../../components/Carousel";
import type { Slide } from "../../components/Carousel";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { NavLink } from "react-router-dom";

// 🔹 Tipos
type Noticia = {
  id: string;
  titulo: string;
  contenido: string;
  createdAt?: any;
  coverUrl?: string;
};

type Actividad = {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
};

export default function Home() {
  const [slidesNoticias, setSlidesNoticias] = useState<Slide[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  /* ----------------------------------------------
   🔥 CARRUSEL: obtener últimas 5 noticias
  ---------------------------------------------- */
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => doc.data() as Noticia)
        .filter((n) => n.coverUrl) // Solo noticias con imagen
        .map(
          (n): Slide => ({
            src: n.coverUrl!,
            title: n.titulo,
            text: n.contenido?.slice(0, 80) + "…",
          })
        );

      setSlidesNoticias(data);
    });

    return () => unsub();
  }, []);

  /* ----------------------------------------------
   📰 Últimas noticias (cards inferiores)
  ---------------------------------------------- */
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Noticia),
        id: doc.id,
      }));
      setNoticias(docs);
    });

    return () => unsub();
  }, []);

  /* ----------------------------------------------
   🎉 Actividades próximas
  ---------------------------------------------- */
  useEffect(() => {
    const q = query(
      collection(db, "actividades"),
      orderBy("fecha", "asc"),
      limit(3)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...(doc.data() as Actividad),
        id: doc.id,
      }));
      setActividades(docs);
    });

    return () => unsub();
  }, []);

  return (
    <main className="home">
      {/* 📰 Carrusel principal ahora dinámico */}
      <section className="section block">
        <h2 className="section-title">Noticias y eventos</h2>

        {slidesNoticias.length > 0 ? (
          <Carousel slides={slidesNoticias} interval={5000} />
        ) : (
          <p style={{ textAlign: "center", color: "#777" }}>
            Cargando noticias…
          </p>
        )}
      </section>

      {/* ⚙️ Accesos rápidos */}
      <section className="layout">
 <div className="grid">
  <NavLink className="card quick" to="/EspaciosUser">
    <div className="card-content">
      <span className="card-emoji">🏠</span>
      <h3 className="card-title">Reservar espacio</h3>
      <p className="card-desc">
        Agenda la sede social, multicancha o sala de reuniones.
      </p>
    </div>
  </NavLink>

  <NavLink className="card quick" to="/Proyectos">
    <div className="card-content">
      <span className="card-emoji">💡</span>
      <h3 className="card-title">Proyectos</h3>
      <p className="card-desc">
        Revisa iniciativas, apoya o propone ideas para tu barrio.
      </p>
    </div>
  </NavLink>

  <NavLink className="card quick" to="/ActividadesUser">
    <div className="card-content">
      <span className="card-emoji">🎉</span>
      <h3 className="card-title">Actividades</h3>
      <p className="card-desc">
        Participa en talleres, operativos y eventos comunitarios.
      </p>
    </div>
  </NavLink>

  <NavLink className="card quick" to="/noticias">
    <div className="card-content">
      <span className="card-emoji">📰</span>
      <h3 className="card-title">Noticias</h3>
      <p className="card-desc">
        Infórmate de las últimas novedades del barrio.
      </p>
    </div>
  </NavLink>
</div>

        {/* 📅 Lateral derecho */}
        <aside className="aside">
          <div className="aside-card">
            <h4>Próximas actividades</h4>
            {actividades.length === 0 ? (
              <p style={{ color: "#777" }}>No hay actividades próximas.</p>
            ) : (
              <ul>
                {actividades.map((a) => (
                  <li key={a.id}>
                    <span className="tag">{a.fecha}</span>
                    <span>{a.titulo}</span>
                  </li>
                ))}
              </ul>
            )}
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

      {/* 🗞️ Noticias recientes */}
      <section className="section">
        <h2 className="section-title">Últimas noticias</h2>
        <div className="news-grid">
          {noticias.length === 0 ? (
            <p>No hay noticias publicadas.</p>
          ) : (
            noticias.map((n) => (
              <article key={n.id} className="news-card">
                {n.coverUrl && (
                  <img src={n.coverUrl} alt={n.titulo} className="news-cover" />
                )}
                <header>
                  <span className="pill">
                    {n.createdAt?.toDate
                      ? n.createdAt.toDate().toLocaleDateString()
                      : ""}
                  </span>
                  <h3>{n.titulo}</h3>
                </header>
                <p>{n.contenido?.slice(0, 90) || "Sin descripción..."}</p>
                <NavLink className="link" to={`/NoticiasVer/${n.id}`}>
                  Leer más →
                </NavLink>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
