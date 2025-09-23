import "../styles/Contacto.css";  // 👈 importa los estilos de esta págin
export default function Contacto() {
  return (
    <div className="contact-page">
      {/* Encabezado */}
      <h2>Contacto</h2>
      <p>
        Si tienes dudas, sugerencias o quieres comunicarte con la Junta de Vecinos,
        utiliza el formulario o la información de contacto directo.
      </p>

      {/* Formulario */}
      <form className="contact-form">
        <label>
          Nombre:
          <input type="text" name="nombre" placeholder="Tu nombre" required />
        </label>

        <label>
          Correo electrónico:
          <input type="email" name="email" placeholder="tucorreo@ejemplo.com" required />
        </label>

        <label>
          Mensaje:
          <textarea name="mensaje" rows={5} placeholder="Escribe tu mensaje aquí..." required />
        </label>

        <button type="submit" className="btn-enviar">Enviar</button>
      </form>

      {/* Información de contacto directo */}
      <div className="contact-info">
        <h3>También puedes contactarnos en:</h3>
        <p><strong>Dirección:</strong> Calle Principal 123, Barrio Ejemplo</p>
        <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
        <p><strong>Email:</strong> contacto@mibarriodigital.cl</p>
      </div>
    </div>
  );
}