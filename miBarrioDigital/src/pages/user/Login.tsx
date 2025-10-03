import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import "../../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // éxito: redirige a Home (o panel)
      navigate("/");
    } catch (err: any) {
      const code = err?.code || "";
      const map: Record<string, string> = {
        "auth/invalid-email": "Correo inválido.",
        "auth/user-not-found": "Usuario no existe.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
      };
      setMsg(map[code] ?? "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading || !email || !password}>
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        {msg && <p style={{ marginTop: 8, color: "#b91c1c" }}>{msg}</p>}

        <p>
          ¿No tienes cuenta? <NavLink to="/registro">Regístrate aquí</NavLink>
        </p>
      </div>
    </div>
  );
}
