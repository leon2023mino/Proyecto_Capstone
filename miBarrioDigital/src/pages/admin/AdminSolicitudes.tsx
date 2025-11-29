import { useState } from "react";
import { useSolicitudes } from "../../hooks/useSolicitudes";
import { useRegistroUser } from "../../hooks/useRegistroUser";
import { getAuth } from "firebase/auth";

export default function AdminSolicitudes() {
  const [filtroEstado, setFiltroEstado] = useState<
    "pendiente" | "aprobada" | "rechazada" | "todas"
  >("todas");

  // Estado para mensajes y control de acción en curso
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  // 🔹 Hook que carga las solicitudes
  const { solicitudes, loading } = useSolicitudes(
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

  const handleAprobar = async (id: string, solicitud: any) => {
    setMensaje(null);
    setError(null);
    setProcesandoId(id);

    try {
      await aprobarSolicitud(id, solicitud, adminId);
      setMensaje("Solicitud aprobada correctamente.");
    } catch (err: any) {
      console.error("Error al aprobar solicitud:", err);

      if (err?.code === "auth/email-already-in-use") {
        setError(
          "Esta solicitud corresponde a un correo que ya tiene cuenta registrada. Revisa en 'Administrar usuarios'."
        );
      } else {
        setError("No se pudo aprobar la solicitud. Intenta nuevamente.");
      }
    } finally {
      setProcesandoId(null);
    }
  };

  const handleRechazar = async (id: string) => {
    setMensaje(null);
    setError(null);
    setProcesandoId(id);

    try {
      await rechazarSolicitud(id, adminId);
      setMensaje("Solicitud rechazada correctamente.");
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);
      setError("No se pudo rechazar la solicitud. Intenta nuevamente.");
    } finally {
      setProcesandoId(null);
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div
      className="solicitudes-page"
      style={{ maxWidth: "700px", margin: "0 auto" }}
    >
      <h2>Gestión de Solicitudes</h2>

      {/* Mensajes globales */}
      {mensaje && (
        <div
          style={{
            marginBottom: "0.75rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            backgroundColor: "#e3f6eb",
            color: "#166534",
            fontSize: "0.9rem",
          }}
        >
          {mensaje}
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: "0.75rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

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
            const esCertificado = s.tipo === "certificado";
            const esRegistro = s.tipo === "registro";

            const estaProcesando = procesandoId === s.id;

            return (
              <li
                key={s.id}
                style={{
                  background: esActividad
                    ? "#eaf7ff" // azul claro
                    : esCertificado
                    ? "#fff7e5" // amarillo claro
                    : "#f4f4f4", // gris
                  borderLeft: esActividad
                    ? "5px solid #1b56a4"
                    : esCertificado
                    ? "5px solid #c78300"
                    : "5px solid #57b460",
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                }}
              >
                {/* 🔹 Encabezado dinámico */}
                <strong>
                  {esActividad
                    ? `Solicitud de cupo en: ${
                        s.tituloActividad || "Actividad desconocida"
                      }`
                    : esCertificado
                    ? `Solicitud de certificado de residencia — ${
                        s.datos?.nombre || "Usuario"
                      }`
                    : `Solicitud de registro — ${s.datos?.nombre || "Usuario"}`}
                </strong>{" "}
                — <em>{s.tipo}</em>
                <br />

                {/* 🔹 Información específica */}
                {esActividad ? (
                  <>
                    <small>👤 Solicitante: {s.datos?.nombre}</small>
                    <br />
                    <small>📧 {s.datos?.email}</small>
                    <br />
                    <small>🗓️ Actividad ID: {s.actividadId}</small>
                    <br />
                  </>
                ) : esCertificado ? (
                  <>
                    <small>👤 Vecino: {s.datos?.nombre}</small>
                    <br />
                    <small>📧 {s.datos?.email}</small>
                    <br />
                    <small>🏠 Dirección: {s.datos?.direccion}</small>
                    <br />
                    <small>🏙️ Comuna: {s.datos?.comuna}</small>
                    <br />
                    <small>🪪 RUT: {s.datos?.rut}</small>
                    <br />
                  </>
                ) : (
                  <>
                    <small>📧 Correo: {s.datos?.email}</small>
                    <br />
                    <small>🏠 Dirección: {s.datos?.direccion}</small>
                    <br />
                    <small>🪪 RUT: {s.datos?.rut}</small>
                    <br />
                  </>
                )}

                {/* 🔹 Estado */}
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

                {/* 🔹 Botones */}
                {s.estado === "pendiente" && (
                  <div style={{ marginTop: "0.6rem" }}>
                    <button
                      onClick={() => handleAprobar(s.id!, s)}
                      style={{
                        marginRight: "0.5rem",
                        backgroundColor: "#57b460",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: estaProcesando ? "default" : "pointer",
                        opacity: estaProcesando ? 0.7 : 1,
                      }}
                      disabled={estaProcesando}
                    >
                      {estaProcesando ? "Procesando..." : "✅ Aprobar"}
                    </button>

                    <button
                      onClick={() => handleRechazar(s.id!)}
                      style={{
                        backgroundColor: "#c73f3f",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: estaProcesando ? "default" : "pointer",
                        opacity: estaProcesando ? 0.7 : 1,
                      }}
                      disabled={estaProcesando}
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
