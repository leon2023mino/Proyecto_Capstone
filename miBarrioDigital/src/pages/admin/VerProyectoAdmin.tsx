import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/VerProyectoAdmin.css";

type Estado = "en-curso" | "finalizado" | "pendiente";

type Proyecto = {
  id: number;
  titulo: string;
  descripcion: string;
  estado: Estado;
  creado: string;       // ISO o legible
  actualizado: string;  // ISO o legible
  responsable: string;
};

export default function VerProyectoAdmin() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { id?: number } };

  // ⚠️ Si llegas directo por URL sin state, puedes redirigir o mostrar un placeholder
  const id = state?.id ?? null;

  // Demo: datos mock (luego se reemplaza por fetch/Firestore)
  const proyecto: Proyecto = {
    id: id ?? 0,
    titulo: "Plaza Inclusiva Sector Norte",
    descripcion:
      "Mejoramiento de juegos con accesibilidad universal, rampas y mobiliario inclusivo en la plaza del sector norte, diseñado junto a la comunidad.",
    estado: "en-curso",
    creado: "2025-08-15",
    actualizado: "2025-09-07",
    responsable: "Comité de Infraestructura",
  };

  const eliminarProyecto = () => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
    // TODO: eliminar en DB
    alert("Proyecto eliminado ✅");
    navigate("/AdministrarProyectos");
  };

  // Si no hay id (navegación directa), muestra aviso
  if (!id) {
    return (
      <div className="ver-proyecto-page">
        <h2 className="ver-proyecto-titulo">Proyecto no encontrado</h2>
        <p className="ver-proyecto-warning">
          No se recibió un ID de proyecto. Vuelve a la lista y selecciona un proyecto.
        </p>
        <div className="ver-proyecto-actions">
          <button className="btn-ghost" onClick={() => navigate("/AdministrarProyectos")}>
            ← Volver a Proyectos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ver-proyecto-page">
      <header className="ver-proyecto-header">
        <h2 className="ver-proyecto-titulo">{proyecto.titulo}</h2>
        <span className={`ver-proyecto-estado estado-${proyecto.estado}`}>
          {proyecto.estado.replace("-", " ")}
        </span>
      </header>

      <p className="ver-proyecto-desc">{proyecto.descripcion}</p>

      <section className="ver-proyecto-info">
        <p><b>Responsable:</b> {proyecto.responsable}</p>
        <p><b>Creado:</b> {proyecto.creado}</p>
        <p><b>Última actualización:</b> {proyecto.actualizado}</p>
      </section>

      <div className="ver-proyecto-actions">
        <button className="btn-ghost" onClick={() => navigate("/AdministrarProyectos")}>
          ← Volver
        </button>
        <button
          className="button--secondary"
          onClick={() => navigate("/CrearProyecto", { state: { editId: proyecto.id } })}
        >
          Editar
        </button>
        <button className="button--danger" onClick={eliminarProyecto}>
          Eliminar
        </button>
      </div>
    </div>
  );
}