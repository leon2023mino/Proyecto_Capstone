import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Espacio } from "../../hooks/useEspacios";
import "../../styles/AdministrarEspacios.css";
import { NavLink, useNavigate } from "react-router-dom";

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
      `¿Estás seguro que deseas marcar este espacio como ${
        nuevoEstado ? "Activo" : "Inactivo"
      }?`
    );
    if (!confirmar) return;

    try {
      const ref = doc(db, "spaces", espacio.id);
      await updateDoc(ref, { activo: nuevoEstado });
      alert(`✅ Estado cambiado a ${nuevoEstado ? "Activo" : "Inactivo"}`);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("❌ Error al cambiar el estado.");
    }
  };

  // 🔹 Navegar al detalle del espacio
  const irAlEspacio = () => {
    navigate(`/VerEspacio/${espacio.id}`);
  };

  return (
    <div className="espacio-card">
      {/* 🔹 Imagen superior */}
      {espacio.imagen ? (
        <img
          src={espacio.imagen}
          alt={espacio.nombre}
          className="espacio-thumb"
        />
      ) : (
        <div className="espacio-thumb sin-imagen">Sin imagen</div>
      )}

      {/* 🔹 Contenido principal */}
      <div className="espacio-body">
        <div className="espacio-header">
          <h3>{espacio.nombre}</h3>

          {role === "admin" ? (
            <button
              onClick={toggleActivo}
              className={`estado-btn ${espacio.activo ? "activo" : "inactivo"}`}
            >
              {espacio.activo ? "Activo" : "Inactivo"}
            </button>
          ) : (
            <span
              className={`estado-label ${
                espacio.activo ? "activo" : "inactivo"
              }`}
            >
              {espacio.activo ? "Activo" : "Inactivo"}
            </span>
          )}
        </div>

        <p>
          <strong>Tipo:</strong> {espacio.tipo}
        </p>
        <p>
          <strong>Aforo:</strong> {espacio.aforo}
        </p>
        <p>
          <strong>Ubicación:</strong> {espacio.ubicacion}
        </p>

        {/* 🔹 Botones inferiores */}
        <div className="espacio-footer">
          {/* Solo admins pueden editar */}
          {role === "admin" && (
            <NavLink
              to={`/admin/EditarEspacio/${espacio.id}`}
              className="btn-editar-espacio"
            >
              ✏️ Editar espacio
            </NavLink>
          )}

          {/* 🔹 Solo vecinos o usuarios normales pueden ver el espacio */}
          {(role === "vecino" || role === "usuario" || !role) && (
            <button
              onClick={irAlEspacio}
              className="btn-ver-espacio"
              disabled={!espacio.activo}
              title={
                espacio.activo
                  ? "Ver más detalles del espacio"
                  : "Espacio inactivo temporalmente"
              }
            >
              🏡 Ver espacio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
