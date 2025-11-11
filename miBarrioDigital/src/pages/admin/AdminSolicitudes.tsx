import { useState } from "react";
import { useSolicitudes } from "../../hooks/useSolicitudes";
import { useRegistroUser } from "../../hooks/useRegistroUser";
import { getAuth } from "firebase/auth";

export default function AdminSolicitudes() {
  const [filtroEstado, setFiltroEstado] = useState<
    "pendiente" | "aprobada" | "rechazada" | "todas"
  >("todas");

  // 🔹 Hook que carga las solicitudes
  const { solicitudes, loading, error } = useSolicitudes(
    undefined,
    filtroEstado === "todas" ? undefined : filtroEstado
  );

  // 🔹 Hook con la lógica de aprobación/rechazo
  const { aprobarSolicitud, rechazarSolicitud } = useRegistroUser();

  // 🔸 Obtener el ID del admin actual
  const admin = getAuth().currentUser;
  const adminId = admin?.uid || "admin-desconocido";

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEstado(e.target.value as any);
  };

  if (loading) return <p>Cargando solicitudes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      className="solicitudes-page"
      style={{ maxWidth: "700px", margin: "0 auto" }}
    >
      <h2>Gestión de Solicitudes</h2>

      {/* Selector de filtro */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="filtro">Filtrar por estado: </label>
        <select id="filtro" value={filtroEstado} onChange={handleFiltroChange}>
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes en este estado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {solicitudes.map((s) => {
            const esActividad = s.tipo === "actividad";

            return (
              <li
                key={s.id}
                style={{
                  background: esActividad ? "#eaf7ff" : "#f4f4f4",
                  borderLeft: esActividad ? "5px solid #1b56a4" : "5px solid #57b460",
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                {/* Título principal */}
                <strong>
                  {esActividad
                    ? `Solicitud de cupo en: ${s.tituloActividad || "Actividad desconocida"}`
                    : s.datos?.nombre || "Sin nombre"}
                </strong>{" "}
                — <em>{s.tipo}</em>
                <br />

                {/* Información específica */}
                {esActividad ? (
                  <>
                    <small>👤 Solicitante: {s.datos?.nombre}</small>
                    <br />
                    <small>📧 {s.datos?.email}</small>
                    <br />
                    <small>🗓️ Actividad ID: {s.actividadId}</small>
                    <br />
                  </>
                ) : (
                  <>
                    <small>Correo: {s.datos?.email}</small>
                    <br />
                    <small>Dirección: {s.datos?.direccion}</small>
                    <br />
                    <small>RUT: {s.datos?.rut}</small>
                    <br />
                  </>
                )}

                {/* Estado */}
                <small>
                  Estado:{" "}
                  <span
                    style={{
                      color:
                        s.estado === "pendiente"
                          ? "#c78300"
                          : s.estado === "aprobada"
                          ? "green"
                          : "red",
                      fontWeight: 600,
                    }}
                  >
                    {s.estado}
                  </span>
                </small>

                {/* Botones */}
                {s.estado === "pendiente" && (
                  <div style={{ marginTop: "0.6rem" }}>
                    <button
                      onClick={() => aprobarSolicitud(s.id!, s, adminId)}
                      style={{
                        marginRight: "0.5rem",
                        backgroundColor: "#57b460",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ✅ Aprobar
                    </button>

                    <button
                      onClick={() => rechazarSolicitud(s.id!, adminId)}
                      style={{
                        backgroundColor: "#c73f3f",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
