import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminProyectos.css";

type Proyecto = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "en-curso" | "finalizado" | "pendiente";
  actualizado: string; // ISO o texto legible
};

export default function AdministrarProyectos() {
  const navigate = useNavigate();

  // Datos de ejemplo (luego se reemplaza por Firestore/DB)
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    {
      id: 101,
      titulo: "Plaza Inclusiva Sector Norte",
      descripcion: "Proyecto de mejoramiento de juegos y accesos.",
      estado: "en-curso",
      actualizado: "2025-09-07",
    },
    {
      id: 102,
      titulo: "Taller de Compostaje",
      descripcion: "Capacitaciones y kits para 50 familias.",
      estado: "pendiente",
      actualizado: "2025-09-05",
    },
    {
      id: 103,
      titulo: "Murales Participativos",
      descripcion: "Intervención artística en muros del barrio.",
      estado: "finalizado",
      actualizado: "2025-08-28",
    },
  ]);

  const verProyecto = (id: number) => {
    // Con tu router actual no hay parámetro, pasamos el id por state
    navigate("/VerProyectoAdmin", { state: { id } });
  };

  const editarProyecto = (id: number) => {
    // Abrimos la pantalla de creación con el id para editar
    navigate("/CrearProyecto", { state: { editId: id } });
  };

  const eliminarProyecto = (id: number) => {
    if (!confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    setProyectos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="admin-proyectos-page">
      <div className="admin-proyectos-header">
        <h2 className="admin-proyectos-title">Administrar Proyectos</h2>
        <p className="admin-proyectos-subtitle">
          Gestiona los proyectos del barrio: edita, elimina o revisa el detalle.
        </p>
      </div>

      {proyectos.length === 0 ? (
        <div className="admin-proyectos-empty">No hay proyectos disponibles.</div>
      ) : (
        <div className="admin-proyectos-grid">
          {proyectos.map((p) => (
            <article key={p.id} className="admin-proyecto-card">
              <header className="admin-proyecto-header">
                <h3 className="admin-proyecto-titulo">{p.titulo}</h3>
                <span className={`admin-proyecto-estado estado-${p.estado}`}>
                  {p.estado.replace("-", " ")}
                </span>
              </header>

              <p className="admin-proyecto-desc">{p.descripcion}</p>

              <footer className="admin-proyecto-meta">
                <span className="meta-fecha">Actualizado: {p.actualizado}</span>
                <div className="admin-proyecto-actions">
                  <button className="btn-ghost" onClick={() => verProyecto(p.id)}>
                    Ver
                  </button>
                  <button className="button--secondary" onClick={() => editarProyecto(p.id)}>
                    Editar
                  </button>
                  <button className="button--danger" onClick={() => eliminarProyecto(p.id)}>
                    Eliminar
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}