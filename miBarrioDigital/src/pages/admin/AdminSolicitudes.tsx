import { useSolicitudes } from "../../hooks/useSolicitudes";

export default function AdminSolicitudes() {
  const { solicitudes, loading, aprobarSolicitud, rechazarSolicitud } = useSolicitudes(
     // mostrar solo pendientes
  );

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div className="solicitudes-page">
      <h2>Solicitudes pendientes</h2>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul>
          {solicitudes.map((s) => (
            <li key={s.id}>
              <b>{s.datos?.nombre || "Sin nombre"}</b> — {s.tipo}
              <br />
              <small>Estado: {s.estado}</small>
              <div className="actions">
                <button onClick={() => aprobarSolicitud(s.id!, "admin123")}>
                  ✅ Aprobar
                </button>
                <button onClick={() => rechazarSolicitud(s.id!, "admin123")}>
                  ❌ Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
