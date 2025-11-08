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

  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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
            // usuario: botón con icono que abre menú contextual
            <div
              className="user-menu"
              ref={menuRef}
              style={{ position: "relative" }}
            >
              <button
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((s) => !s)}
                className="btn"
                title={user.email ?? user.displayName ?? "Cuenta"}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {/* icono simple; reemplaza por SVG si prefieres */}
                <span style={{ fontSize: 18 }}>👤</span>
                <span style={{ display: "none" }}>Abrir menú de usuario</span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                    padding: 8,
                    minWidth: 180,
                    zIndex: 40,
                  }}
                >
                  <NavLink
                    to="/MiPerfil"
                    className="menu-link"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      color: "#111",
                      textDecoration: "none",
                    }}
                  >
                    Mi perfil
                  </NavLink>
                  <NavLink
                    to="/CambiarContraseña"
                    className="menu-link"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      color: "#111",
                      textDecoration: "none",
                    }}
                  >
                    Cambiar contraseña
                  </NavLink>

                  <div
                    style={{ height: 1, background: "#eee", margin: "8px 0" }}
                  />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "crimson",
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
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
          <NavLink to="/ElegirTipoCertificado" className="nav-link">
            CERTIFICADO
          </NavLink>
          <NavLink to="/proyectos" className="nav-link">
            PROYECTOS
          </NavLink>
          <NavLink to="/EspaciosUser" className="nav-link">
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
