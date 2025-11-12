import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import "../../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"error" | "info" | "success" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setMsgType(null);
    setLoading(true);

    try {
      // 🔹 1. Inicia sesión
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // 🔹 2. Busca su rol en Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "vecino"; // default

      // 🔹 3. Mensaje visual
      setMsg("✅ Inicio de sesión exitoso. Redirigiendo...");
      setMsgType("success");

      // 🔹 4. Redirección según rol
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboards");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err: any) {
      const code = err?.code || "";
      let message = "❌ No se pudo iniciar sesión.";
      let type: "error" | "info" = "error";

      switch (code) {
        case "auth/invalid-email":
          message =
            "⚠️ El formato del correo no es válido. Revisa tu dirección de email.";
          break;
        case "auth/user-not-found":
          message =
            "🚫 No existe una cuenta registrada con este correo electrónico.";
          break;
        case "auth/wrong-password":
          message = "🔐 Contraseña incorrecta. Intenta nuevamente.";
          break;
        case "auth/too-many-requests":
          message =
            "⏳ Has intentado demasiadas veces. Espera unos minutos e inténtalo otra vez.";
          break;
        default:
          message = "❌ Ocurrió un error inesperado al iniciar sesión.";
      }

      setMsg(message);
      setMsgType(type);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>
            Bienvenido a <strong>Mi Barrio Digital</strong>
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <button
            className="btn-submit"
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        {msg && (
          <p
            className={`login-message ${
              msgType === "success" ? "success" : "error"
            }`}
          >
            {msg}
          </p>
        )}

        <div className="login-footer">
          ¿No tienes cuenta?{" "}
          <NavLink to="/registro" className="link-strong">
            Regístrate aquí
          </NavLink>
        </div>
      </div>
    </div>
  );
}
