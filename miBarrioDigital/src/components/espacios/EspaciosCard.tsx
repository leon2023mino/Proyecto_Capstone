import { type Espacio } from "../../hooks/useEspacios";

export function EspacioCard({ espacio }: { espacio: Espacio }) {
  return (
    <div className="espacio-card">
      <div className="espacio-header">
        <h3>{espacio.nombre}</h3>
        <span className={`estado ${espacio.activo ? "activo" : "inactivo"}`}>
          {espacio.activo ? "Activo" : "Inactivo"}
        </span>
      </div>
      <p><strong>Tipo:</strong> {espacio.tipo}</p>
      <p><strong>Aforo:</strong> {espacio.aforo}</p>
      <p><strong>Ubicación:</strong> {espacio.ubicacion}</p>
    </div>
  );
}
