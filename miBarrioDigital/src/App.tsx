import "./App.css";
function App() {
  return (
    <div className="app">
      {/* Header superior */}
      <header className="header-top">
        <div className="logo">
          <img src="src\assets\logopng.png" alt="Logo" />
          <h1>Mi Barrio Digital</h1>
        </div>
      </header>

      {/* Header inferior con navegación */}
      <header className="header-bottom">
        <nav>
          <a href="#">Inicio</a>
          <a href="#">Registro / Ingreso</a>
          <a href="#">Certificados</a>  
          <a href="#">Proyectos</a>
          <a href="#">Reservas</a>  
          <a href="#">Noticias</a>
          <a href="#">Contacto</a>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="main">
        <h2>Bienvenido 👋</h2>
        <p>Esta es tu página inicial con doble header.</p>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Mi Barrio Digital - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default App;