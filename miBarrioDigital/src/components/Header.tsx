import "../App.css";
import titulo from "../assets/logo_mibarrio.png";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="header-wrapper">
      {/* 🔹 Capa superior */}
      <div className="header-top">
        <div className="logo">
          <img src={titulo} alt="Mi Barrio Digital" className="titulo-img" />
        </div>

        <div className="header-actions">
          <div className="header-contact">
            <span>✉️ contacto@mibarriodigital.cl</span>
            <span>📞 +56 9 1234 5678</span>
          </div>

          {loading ? (
            <span>...</span>
          ) : user ? (
            <div ref={menuRef} className="user-menu">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="user-icon-btn"
                title={user.email ?? user.displayName ?? "Cuenta"}
              >
                👤
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <NavLink
                    to="/MiPerfil"
                    onClick={() => setMenuOpen(false)}
                    className="dropdown-link"
                  >
                    Mi perfil
                  </NavLink>
                  <NavLink
                    to="/CambiarContraseña"
                    onClick={() => setMenuOpen(false)}
                    className="dropdown-link"
                  >
                    Cambiar contraseña
                  </NavLink>
                  <hr className="dropdown-sep" />
                  <button
                    onClick={handleLogout}
                    className="dropdown-logout"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/Login">
              <button className="btn-login">Iniciar sesión</button>
            </NavLink>
          )}
        </div>
      </div>

      {/* 🔹 Capa inferior (navegación) */}
      <nav className="header-bottom">
        <NavLink to="/" end className="nav-link">
          INICIO
        </NavLink>
        <NavLink to="/ElegirTipoCertificado" className="nav-link">
          CERTIFICADO
        </NavLink>
        <NavLink to="/proyectos" className="nav-link">
          PROYECTOS
        </NavLink>
        <NavLink to="/EspaciosUser" className="nav-link">
          RESERVAS
        </NavLink>
        <NavLink to="/Actividades" className="nav-link">
          ACTIVIDADES
        </NavLink>
        <NavLink to="/noticias" className="nav-link">
          NOTICIAS
        </NavLink>
        <NavLink to="/contacto" className="nav-link">
          CONTACTO
        </NavLink>
      </nav>
    </header>
  );
}

/* ===== FOOTER ===== */
export function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2025 Mi Barrio Digital - Todos los derechos reservados</p>
    </footer>
  );
}
