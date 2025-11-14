import { EspacioCard } from "../../components/espacios/EspacioCard";
import { useEspacios } from "../../hooks/useEspacios";
import { useUserRole } from "../../hooks/useUserRole";
import "../../styles/AdministrarEspacios.css";
import "../../styles/EspaciosUser.css"; // opcional si quieres nuevo estilo
import { NavLink } from "react-router-dom";

export default function EspaciosUser() {
  const { espacios, loading } = useEspacios();
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <p className="loading-text">Cargando espacios...</p>;
  }

  return (
    <div className="espacios-user-page">
      {/* Header */}
      <header className="espacios-user-header">
        <div>
          <h2 className="espacios-title">Espacios Disponibles</h2>
          <p className="espacios-subtitle">
            Reserva y conoce los espacios comunitarios habilitados para los vecinos.
          </p>
        </div>

        {/* Filtros opcionales */}
        {/* 
        <div className="espacios-toolbar">
          <input
            type="search"
            className="espacios-search"
            placeholder="Buscar espacio..."
          />
        </div> 
        */}
      </header>

      {/* Grid */}
      {espacios.length === 0 ? (
        <p className="no-data">No hay espacios creados aún.</p>
      ) : (
        <div className="espacios-grid">
          {espacios.map((espacio) => (
            <EspacioCard
              key={espacio.id}
              espacio={espacio}
              role={role || "vecino"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
