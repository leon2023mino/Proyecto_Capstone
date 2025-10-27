import { useState } from "react";
import { auth } from "../../firebase/config";
import { updatePassword } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/CambiarContraseña.css";

export const CambiarContraseña = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validarFormulario = () => {
    if (!user) return "Debes iniciar sesión para cambiar la contraseña.";
    if (nuevaPass.length < 6)
      return "La nueva contraseña debe tener al menos 6 caracteres.";
    if (nuevaPass !== confirmarPass)
      return "Las contraseñas no coinciden.";
    return null;
  };

  const handleCambiar = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) {
      setMsg(error);
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user!, nuevaPass);
      setMsg("✅ Contraseña actualizada correctamente.");
      setNuevaPass("");
      setConfirmarPass("");
      setTimeout(() => navigate("/MiPerfil"), 2000);
    } catch (err: any) {
      console.error(err);
      setMsg(
        "❌ Error al cambiar la contraseña. Es posible que debas volver a iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cambiar-pass-container">
      <div className="card">
        <h2>Cambiar Contraseña</h2>
        <p className="subtitle">Actualiza tu contraseña de forma segura.</p>

        <form className="cambiar-pass-form" onSubmit={handleCambiar}>
          <div className="form-group">
            <label htmlFor="nueva">Nueva contraseña</label>
            <div className="password-field">
              <input
                id="nueva"
                type={showPass ? "text" : "password"}
                value={nuevaPass}
                onChange={(e) => setNuevaPass(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass((p) => !p)}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <input
              id="confirmar"
              type={showPass ? "text" : "password"}
              value={confirmarPass}
              onChange={(e) => setConfirmarPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="acciones">
            <button
              type="submit"
              className="btn-guardar"
              disabled={loading || !nuevaPass || !confirmarPass}
            >
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </button>

            <NavLink to="/MiPerfil">
              <button type="button" className="btn-volver">
                ← Volver
              </button>
            </NavLink>
          </div>

          {msg && (
            <p className={`msg ${msg.startsWith("✅") ? "success" : "error"}`}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
