import "../App.css";
import titulo from "../assets/logo_mibarrio.png";
import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <div>
      {/* Header superior */}
      <header className="header-top" role="banner">
        {/* Izquierda: solo el título como imagen */}
        <div className="logo" aria-label="Mi Barrio Digital">
          <img src={titulo} alt="Mi Barrio Digital" className="titulo-img" />
        </div>

        {/* Derecha: contacto (solo texto) + botón de login */}
        <div className="header-actions" aria-hidden={false}>
          <div className="header-contact">
            <span className="contact-text">contacto@mibarriodigital.cl</span>
            <span className="contact-text">+56 9 1234 5678</span>
          </div>

          <NavLink to="/Login" className="btn-registro" aria-label="Iniciar sesión">
            Iniciar Sesión
          </NavLink>
        </div>
      </header>

      {/* Header inferior con navegación */}
      <header className="header-bottom" role="navigation" aria-label="Menú principal">
        <nav>
          <NavLink to="/" end className="nav-link">INICIO</NavLink>
          <NavLink to="/certificados" className="nav-link">CERTIFICADO</NavLink>
          <NavLink to="/proyectos" className="nav-link">PROYECTOS</NavLink>
          <NavLink to="/reservas" className="nav-link">RESERVAS</NavLink>
          <NavLink to="/noticias" className="nav-link">NOTICIAS</NavLink>
          <NavLink to="/contacto" className="nav-link">CONTACTO</NavLink>
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