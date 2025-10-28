import { NavLink } from "react-router-dom";

export default function ElegirTipoCertificado() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: "1rem",
            color: "var(--brand-blue, #0b6d44)",
          }}
        >
          Seleccionar certificado
        </h1>
        <p
          style={{
            marginTop: 0,
            marginBottom: "1.5rem",
            color: "var(--text-muted, #666)",
          }}
        >
          Elige el tipo de certificado que deseas obtener.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <NavLink to="/ObetenerCertificado" style={{ width: "100%" }}>
            <button
              className="btn"
              style={{
                width: "100%",
                padding: ".8rem 1rem",
                borderRadius: 8,
                background: "var(--brand-blue, #0b6d44)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
              aria-label="Ir a Obtener Certificado"
            >
              Obtener certificado
            </button>
          </NavLink>

          <NavLink to="/certificados" style={{ width: "100%" }}>
            <button
              className="btn"
              style={{
                width: "100%",
                padding: ".8rem 1rem",
                borderRadius: 8,
                background: "#f3f3f3",
                color: "#111",
                border: "1px solid #e6e6e6",
                cursor: "pointer",
                fontWeight: 600,
              }}
              aria-label="Ver certificados"
            >
              Mis certificados
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
