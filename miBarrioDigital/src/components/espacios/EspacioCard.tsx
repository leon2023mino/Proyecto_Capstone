import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { type Espacio } from "../../hooks/useEspacios";
import "../../styles/AdministrarEspacios.css";

export function EspacioCard({ espacio }: { espacio: Espacio }) {
  const toggleActivo = async () => {
    const nuevoEstado = !espacio.activo;

    // 🔹 Mostrar confirmación
    const confirmar = window.confirm(
      `¿Estás seguro que deseas marcar este espacio como ${
        nuevoEstado ? "Activo" : "Inactivo"
      }?`
    );

    if (!confirmar) return; // ❌ cancelar

    try {
      const ref = doc(db, "spaces", espacio.id);
      await updateDoc(ref, { activo: nuevoEstado });
      alert(`✅ Estado cambiado a ${nuevoEstado ? "Activo" : "Inactivo"}`);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("❌ Hubo un error al intentar cambiar el estado.");
    }
  };

  return (
    <div className="espacio-card">
      <div className="espacio-header">
        <h3>{espacio.nombre}</h3>

        {/* 🔹 Botón de estado */}
        <button
          onClick={toggleActivo}
          className={`estado-btn ${espacio.activo ? "activo" : "inactivo"}`}
        >
          {espacio.activo ? "Activo" : "Inactivo"}
        </button>
      </div>

      <p><strong>Tipo:</strong> {espacio.tipo}</p>
      <p><strong>Aforo:</strong> {espacio.aforo}</p>
      <p><strong>Ubicación:</strong> {espacio.Ubicacion}</p>
    </div>
  );
}
