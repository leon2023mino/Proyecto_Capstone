import "../App.css";
import titulo from "../assets/logo_mibarrio.png";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export function Header() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div>
      {/* Mini header arriba */}

      {/* Header superior */}
      <header className="header-top" role="banner">
        {/* Izquierda: título como imagen */}
        <div className="logo" aria-label="Mi Barrio Digital">
          <img src={titulo} alt="Mi Barrio Digital" className="titulo-img" />
        </div>

        {/* Derecha: contacto + botón de login */}
        <div className="header-actions" aria-hidden={false}>
          <div className="header-contact">
            <span className="contact-text">✉️ contacto@mibarriodigital.cl</span>
            <span className="contact-text">📞 +56 9 1234 5678</span>
          </div>

          {loading ? (
            <span>...</span>
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{user.email ?? user.displayName}</span>
              <button onClick={handleLogout} className="btn">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <NavLink to="/Login">
              <button className="btn">Iniciar sesión</button>
            </NavLink>
          )}
        </div>
      </header>

      {/* Header inferior con navegación */}
      <header
        className="header-bottom"
        role="navigation"
        aria-label="Menú principal"
      >
        <nav>
          <NavLink to="/" end className="nav-link">
            INICIO
          </NavLink>
          <NavLink to="/certificados" className="nav-link">
            CERTIFICADO
          </NavLink>
          <NavLink to="/proyectos" className="nav-link">
            PROYECTOS
          </NavLink>
          <NavLink to="/reservas" className="nav-link">
            RESERVAS
          </NavLink>
          <NavLink to="/noticias" className="nav-link">
            NOTICIAS
          </NavLink>
          <NavLink to="/contacto" className="nav-link">
            CONTACTO
          </NavLink>
        </nav>
      </header>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Mi Barrio Digital - Todos los derechos reservados</p>
    </footer>
  );
}
