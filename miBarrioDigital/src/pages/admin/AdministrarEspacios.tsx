// src/pages/AdministrarEspacios.tsx
import { EspacioCard } from "../../components/espacios/EspacioCard";
import { useEspacios } from "../../hooks/useEspacios";
import  "../../styles/AdministrarEspacios.css";


export default function AdministrarEspacios() {
  const { espacios, loading } = useEspacios();

  if (loading) return <p>Cargando espacios...</p>;

  return (
    <div className="espacios-page">
      <header className="espacios-header">
        <h2>Administrar Espacios</h2>
        <p>Visualiza los espacios registrados en la comunidad.</p>
      </header>

      {espacios.length === 0 ? (
        <p>No hay espacios registrados aún.</p>
      ) : (
        <div className="espacios-grid">
          {espacios.map((espacio) => (
            <EspacioCard key={espacio.id} espacio={espacio} />
          ))}
        </div>
      )}
    </div>
  );
}
