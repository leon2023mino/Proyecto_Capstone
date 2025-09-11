import "../App.css";
import logo from "../assets/logopng.png";
import { NavLink } from "react-router-dom";

function Header() {
  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 ${
      isActive
        ? "text-green-600 font-bold"
        : "text-gray-700 hover:text-green-600"
    }`;
  return (
    <div >
      {/* Header superior */}
      <header className="header-top">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h1>Mi Barrio Digital</h1>
        </div>
      </header>

      {/* Header inferior con navegación */}
      <header className="header-bottom">
        <nav>
          <NavLink to="/" end className={linkStyle}>
            Inicio
          </NavLink>
          <NavLink to="/registro" className={linkStyle}>
            Registro / Ingreso
          </NavLink>
          <NavLink to="/certificados" className={linkStyle}>
            Certificados
          </NavLink>
          <NavLink to="/proyectos" className={linkStyle}>
            Proyectos
          </NavLink>
          <NavLink to="/reservas" className={linkStyle}>
            Reservas
          </NavLink>
          <NavLink to="/noticias" className={linkStyle}>
            Noticias
          </NavLink>
          <NavLink to="/contacto" className={linkStyle}>
            Contacto
          </NavLink>
        </nav>
      </header>
    </div>
  );
}

export default Header;
