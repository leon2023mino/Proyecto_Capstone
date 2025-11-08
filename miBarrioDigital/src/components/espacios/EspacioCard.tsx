import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Espacio } from "../../hooks/useEspacios";
import "../../styles/AdministrarEspacios.css";

type EspacioCardProps = {
  espacio: Espacio;
  role?: string; // 👈 agregamos la prop opcional "rol"
};

export function EspacioCard({ espacio, role }: EspacioCardProps) {
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

  return (
    <div className="espacio-card">
      <div className="espacio-header">
        <h3>{espacio.nombre}</h3>

        {/* 🔹 Mostrar botón solo si el rol es admin */}
        {role === "admin" ? (
          <button
            onClick={toggleActivo}
            className={`estado-btn ${espacio.activo ? "activo" : "inactivo"}`}
          >
            {espacio.activo ? "Activo" : "Inactivo"}
          </button>
        ) : (
          <span
            className={`estado-label ${espacio.activo ? "activo" : "inactivo"}`}
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
    </div>
  );
}
