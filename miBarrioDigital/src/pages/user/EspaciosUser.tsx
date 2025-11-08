import { EspacioCard } from "../../components/espacios/EspacioCard";
import { useEspacios } from "../../hooks/useEspacios";
import { useUserRole } from "../../hooks/useUserRole";
import "../../styles/AdministrarEspacios.css";
import { NavLink } from "react-router-dom";

export default function EspaciosUser() {
  const { espacios, loading } = useEspacios();
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) return <p>Cargando...</p>;

  return (
    <div className="espacios-page">
      <h2>Espacios Disponibles</h2>

      <div className="espacios-grid">
        {espacios.map((espacio) => (
          <EspacioCard
            key={espacio.id}
            espacio={espacio}
            role={role || "vecino"} // por defecto vecino si no hay rol
          />
        ))}
      </div>
       <NavLink to="/AdministrarEspacios">
        <button className="admin-button">Administrar Espacios</button></NavLink>
    </div>
   

    
  );
}