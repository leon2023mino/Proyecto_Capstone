import { useState, useMemo } from "react";
import { auth } from "../../firebase/config";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/CambiarContraseña.css";

export const CambiarContraseña = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [actualPass, setActualPass] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // 🔹 Evalúa la seguridad de la nueva contraseña
  const evaluarSeguridad = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const seguridad = useMemo(() => evaluarSeguridad(nuevaPass), [nuevaPass]);

  const getNivelSeguridad = () => {
    if (seguridad <= 1) return { texto: "Débil", color: "#dc2626" };
    if (seguridad <= 3) return { texto: "Media", color: "#f59e0b" };
    return { texto: "Fuerte", color: "#16a34a" };
  };

  const validarFormulario = () => {
    if (!user) return "Debes iniciar sesión para cambiar la contraseña.";
    if (!actualPass) return "Debes ingresar tu contraseña actual.";
    if (nuevaPass.length < 6)
      return "La nueva contraseña debe tener al menos 6 caracteres.";
    if (nuevaPass === actualPass)
      return "La nueva contraseña no puede ser igual a la actual.";
    if (nuevaPass !== confirmarPass)
      return "Las contraseñas nuevas no coinciden.";
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
      setMsg(null);

      // 🔹 Verificar contraseña actual
      const credential = EmailAuthProvider.credential(user!.email!, actualPass);
      await reauthenticateWithCredential(user!, credential);

      // 🔹 Cambiar contraseña
      await updatePassword(user!, nuevaPass);
      setMsg("✅ Contraseña actualizada correctamente.");
      setActualPass("");
      setNuevaPass("");
      setConfirmarPass("");
      setTimeout(() => navigate("/MiPerfil"), 2000);
    } catch (err: any) {
      console.error(err);

      let mensaje = "❌ Error al cambiar la contraseña.";
      if (err.code === "auth/wrong-password") {
        mensaje = "⚠️ La contraseña actual es incorrecta.";
      } else if (err.code === "auth/requires-recent-login") {
        mensaje =
          "🔒 Por seguridad, debes volver a iniciar sesión antes de cambiar la contraseña.";
        setTimeout(() => navigate("/Login"), 3000);
      }
      setMsg(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cambiar-pass-container">
      <div className="card">
        <h2>Cambiar Contraseña</h2>
        <p className="subtitle">Verifica tu identidad antes de actualizarla.</p>

        <form className="cambiar-pass-form" onSubmit={handleCambiar}>
          {/* Contraseña actual */}
          <div className="form-group">
            <label htmlFor="actual">Contraseña actual</label>
            <div className="password-field">
              <input
                id="actual"
                type={showPass ? "text" : "password"}
                value={actualPass}
                onChange={(e) => setActualPass(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass((p) => !p)}
                title={showPass ? "Ocultar contraseñas" : "Mostrar contraseñas"}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div className="form-group">
            <label htmlFor="nueva">Nueva contraseña</label>
            <input
              id="nueva"
              type={showPass ? "text" : "password"}
              value={nuevaPass}
              onChange={(e) => setNuevaPass(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* 🔹 Indicador de seguridad */}
            {nuevaPass && (
              <div className="password-strength">
                <div
                  className="bar"
                  style={{
                    width: `${(seguridad / 5) * 100}%`,
                    backgroundColor: getNivelSeguridad().color,
                  }}
                ></div>
                <span
                  className="strength-text"
                  style={{ color: getNivelSeguridad().color }}
                >
                  {getNivelSeguridad().texto}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar nueva contraseña */}
          <div className="form-group">
            <label htmlFor="confirmar">Confirmar nueva contraseña</label>
            <input
              id="confirmar"
              type={showPass ? "text" : "password"}
              value={confirmarPass}
              onChange={(e) => setConfirmarPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Botones */}
          <div className="acciones">
            <button
              type="submit"
              className="btn-guardar"
              disabled={
                loading || !actualPass || !nuevaPass || !confirmarPass
              }
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
