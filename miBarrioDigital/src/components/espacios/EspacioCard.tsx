import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Espacio } from "../../hooks/useEspacios";
import "../../styles/AdministrarEspacios.css";
import { NavLink, useNavigate } from "react-router-dom";

import { Pencil, Trash2, Eye } from "lucide-react";

type EspacioCardProps = {
  espacio: Espacio;
  role?: string;
};

export function EspacioCard({ espacio, role }: EspacioCardProps) {
  const navigate = useNavigate();

  // 🔹 Cambiar estado (solo admin)
  const toggleActivo = async () => {
    const nuevoEstado = !espacio.activo;
    const confirmar = window.confirm(
      `¿Deseas marcar este espacio como ${
        nuevoEstado ? "Activo" : "Inactivo"
      }?`
    );
    if (!confirmar) return;

    try {
      const ref = doc(db, "spaces", espacio.id);
      await updateDoc(ref, { activo: nuevoEstado });
      alert(`✅ Estado actualizado correctamente.`);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("❌ No se pudo cambiar el estado.");
    }
  };

  // 🔥 Eliminar espacio (solo admin)
  const borrarEspacio = async () => {
    const confirmar = window.confirm(
      `⚠️ ¿Eliminar el espacio "${espacio.nombre}"?\nEsta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "spaces", espacio.id));
      alert("🗑️ Espacio eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ No se pudo eliminar el espacio.");
    }
  };

  return (
    <article className="espacio-card">
      {/* Imagen */}
      {espacio.imagen ? (
        <img src={espacio.imagen} alt={espacio.nombre} className="espacio-thumb" />
      ) : (
        <div className="espacio-thumb sin-imagen">Sin imagen</div>
      )}

      <div className="espacio-body">
        <div className="espacio-header">
          <h3>{espacio.nombre}</h3>

          {/* CHIP de estado */}
          {role === "admin" ? (
            <button
              onClick={toggleActivo}
              className={`estado-chip-admin ${
                espacio.activo ? "chip-activo" : "chip-inactivo"
              }`}
            >
              {espacio.activo ? "Activo" : "Inactivo"}
            </button>
          ) : (
            <span
              className={`estado-chip ${
                espacio.activo ? "chip-activo" : "chip-inactivo"
              }`}
            >
              {espacio.activo ? "Activo" : "Inactivo"}
            </span>
          )}
        </div>

        {/* Información */}
        <div className="espacio-info">
          <p><strong>Tipo:</strong> {espacio.tipo}</p>
          <p><strong>Aforo:</strong> {espacio.aforo}</p>
          <p><strong>Ubicación:</strong> {espacio.ubicacion}</p>
        </div>

        {/* ACCIONES */}
        <div className="espacio-footer">
          {role === "admin" ? (
            <>
              <NavLink
                to={`/admin/EditarEspacio/${espacio.id}`}
                className="btn-admin-blue"
              >
                <Pencil size={16} /> Editar
              </NavLink>

              <button className="btn-admin-red" onClick={borrarEspacio}>
                <Trash2 size={16} /> Eliminar
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate(`/VerEspacio/${espacio.id}`)}
              className="btn-admin-blue-outline"
              disabled={!espacio.activo}
            >
              <Eye size={16} /> Ver espacio
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
