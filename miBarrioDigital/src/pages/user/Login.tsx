// src/pages/auth/Login.tsx  (ajusta la ruta si la tuya es distinta)
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 🔒 Aquí luego harás la llamada a tu backend
    console.log("Iniciando sesión con:", { email, password, remember });
    setTimeout(() => setLoading(false), 600); // demo
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido a Mi Barrio Digital</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-field">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
              <button
                type="button"
                className="toggle-pass"
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPass((v) => !v)}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordarme
            </label>

            <NavLink to="/recuperar" className="link-muted">
              ¿Olvidaste tu contraseña?
            </NavLink>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading || !email || !password}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <footer className="login-footer">
          <span>¿No tienes cuenta?</span>{" "}
          <NavLink to="/registro" className="link-strong">
            Regístrate aquí
          </NavLink>
        </footer>
      </div>
    </div>
  );
}