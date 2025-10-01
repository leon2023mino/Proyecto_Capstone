import "../App.css";
import logo from "../assets/logopng.png";
import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <div>
      {/* Header superior */}
      <header className="header-top">
        {/* Izquierda: logo + título */}
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h1>Mi Barrio Digital</h1>
        </div>

        {/* Derecha: botón de registro */}
        <div className="header-actions">
          <NavLink to="/Login" className="btn-registro">
            Ingreso
          </NavLink>
        </div>
      </header>

      {/* Header inferior con navegación */}
      <header className="header-bottom">
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
