import "../../styles/Registro.css";

export default function Registro() {
  return (
    <div className="registro-page">
      <h2>Registro de Vecinos</h2>
      <p>
        Completa el siguiente formulario para registrarte en{" "}
        <b> Mi Barrio Digital </b>y acceder a certificados, reservas, proyectos
        y más.
      </p>

      <form className="registro-form">
        <label>
          Nombre completo:
          <input
            type="text"
            name="nombre"
            placeholder="Ej: Juan Pérez"
            required
          />
        </label>

        <label>
          RUT:
          <input type="text" name="rut" placeholder="12.345.678-9" required />
        </label>

        <label>
          Correo electrónico:
          <input
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            required
          />
        </label>

        <label>
          Dirección:
          <input
            type="text"
            name="direccion"
            placeholder="Calle, número, comuna"
          />
        </label>

        <label>
          Contraseña:
          <input type="password" name="password" required />
        </label>

        <button type="submit" className="btn-enviar">
          Registrarse
        </button>
      </form>
    </div>
  );
}
