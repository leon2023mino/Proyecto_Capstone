import { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import { auth } from "../../firebase/config";
import { updateProfile } from "firebase/auth";
import "../../styles/MiPerfil.css";

export const MiPerfil = () => {
  const user = auth.currentUser;
  const [nombre, setNombre] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNombre(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setGuardando(true);
    setMsg(null);
    try {
      if (nombre && nombre !== user.displayName) {
        await updateProfile(user, { displayName: nombre });
      }
      setMsg("✅ Cambios guardados correctamente.");
    } catch (err: any) {
      console.error(err);
      setMsg("❌ Error al actualizar perfil. Intenta nuevamente.");
    } finally {
      setGuardando(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  if (!user) {
    return (
      <div className="perfil-container">
        <h2>Mi Perfil</h2>
        <p>Debes iniciar sesión para ver tu información.</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>
      <p className="perfil-subtitle">Administra tu información personal</p>

      <form className="perfil-form" onSubmit={handleGuardar}>
        <div className="perfil-field">
          <label>Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>

        <div className="perfil-field">
          <label>Correo electrónico</label>
          <input type="email" value={email} disabled />
          <small>No se puede cambiar el correo asociado a la cuenta.</small>
        </div>

        {/* Botón para cambiar contraseña */}
        <div className="perfil-field">
          <label>Contraseña</label>
          <NavLink to="/CambiarContraseña">
            <button
              type="button"
              className="btn-secundario"
              style={{
                background: "var(--brand-blue)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 1.2rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.2s ease, filter 0.2s ease",
              }}
            >
              Cambiar contraseña
            </button>
          </NavLink>
        </div>

        <div className="perfil-actions">
          <button type="submit" className="btn-guardar" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        {msg && (
          <p
            className={`perfil-msg ${
              msg.startsWith("✅") ? "success" : "error"
            }`}
          >
            {msg}
          </p>
        )}
      </form>
    </div>
  );
};
