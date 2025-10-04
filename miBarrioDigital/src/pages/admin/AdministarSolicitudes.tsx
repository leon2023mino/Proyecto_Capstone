import { useState } from "react";
import "../../styles/AdminSolicitudes.css";

type Solicitud = {
  id: number;
  nombre: string;
  tipo: string;
  estado: "pendiente" | "aceptada" | "rechazada";
};

export default function AdministarSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    { id: 1, nombre: "Juan Pérez", tipo: "Certificado de Residencia", estado: "pendiente" },
    { id: 2, nombre: "María González", tipo: "Uso de Espacio Común", estado: "pendiente" },
    { id: 3, nombre: "Carlos López", tipo: "Postulación Proyecto", estado: "pendiente" },
  ]);

  const actualizarEstado = (id: number, nuevoEstado: Solicitud["estado"]) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    );
  };

  return (
    <div className="solicitudes-page">
      <h2>Administrar Solicitudes</h2>
      <p>Lista de solicitudes recibidas. Puedes aceptar o rechazar cada una.</p>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul className="solicitudes-lista">
          {solicitudes.map((s) => (
            <li key={s.id} className="solicitud-card">
              <div className="solicitud-header">
                <span className="solicitud-nombre">{s.nombre}</span>
                <span className="solicitud-tipo">{s.tipo}</span>
              </div>
              <div className={`solicitud-estado estado-${s.estado}`}>
                Estado: {s.estado}
              </div>
              <div className="solicitud-actions">
                <button
                  className="button--secondary"
                  onClick={() => actualizarEstado(s.id, "aceptada")}
                  disabled={s.estado !== "pendiente"}
                >
                  Aceptar
                </button>
                <button
                  className="button--accent"
                  onClick={() => actualizarEstado(s.id, "rechazada")}
                  disabled={s.estado !== "pendiente"}
                >
                  Rechazar
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => alert(`Ver detalles de ${s.nombre}`)}
                >
                  Ver Detalles
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}