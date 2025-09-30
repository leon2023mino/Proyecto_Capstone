import "../styles/Contacto.css";
import { useState } from "react";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.nombre || !form.email || !form.mensaje) {
      return "Por favor, completa nombre, correo y mensaje.";
    }
    // Validación simple de email (además del type="email")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "El correo no tiene un formato válido.";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    setSending(true);
    // Simulación de envío
    setTimeout(() => {
      console.log("Mensaje enviado:", form);
      alert("✅ ¡Tu mensaje fue enviado! Te responderemos a la brevedad.");
      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
      setSending(false);
    }, 600);
  };

  return (
    <div className="contact-page">
      <div className="contact-grid">
        {/* Columna: Formulario */}
        <div className="contact-card">
          <h2 className="contact-title">Contacto</h2>
          <p className="contact-subtitle">
            Si tienes dudas, sugerencias o quieres comunicarte con la Junta de Vecinos,
            utiliza el formulario o nuestros datos de contacto directo.
          </p>

        

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="input"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="tucorreo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="asunto">Asunto (opcional)</label>
              <input
                id="asunto"
                name="asunto"
                type="text"
                className="input"
                placeholder="Ej: Consulta por actividades"
                value={form.asunto}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                className="textarea"
                rows={5}
                placeholder="Escribe tu mensaje aquí..."
                value={form.mensaje}
                onChange={handleChange}
                required
              />
              <small className="helper">Sé lo más claro posible para ayudarte mejor.</small>
            </div>

            <div className="actions">
              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? "Enviando..." : "Enviar"}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setForm({ nombre: "", email: "", asunto: "", mensaje: "" })}
                disabled={sending}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {/* Columna: Información de contacto */}
        <aside className="sidebar-card">
          <h3>Información de contacto</h3>
          <ul className="contact-list">
            <li>
              <span className="contact-chip">Dirección</span>
              <span>Calle Principal 123, Barrio Ejemplo</span>
            </li>
            <li>
              <span className="contact-chip">Teléfono</span>
              <a href="tel:+56912345678">+56 9 1234 5678</a>
            </li>
            <li>
              <span className="contact-chip">Email</span>
              <a href="mailto:contacto@mibarriodigital.cl">contacto@mibarriodigital.cl</a>
            </li>
          </ul>

          <div className="divider" />

          <h3>Ubicación</h3>
          <div className="map-box">
            {/* Puedes cambiar el src por tu dirección real en Google Maps */}
            <iframe
              title="Mapa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.644418621998!2d-70.648!3d-33.437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI2JzEzLjIiUyA3MMKwMzgnNTMuMCJX!5e0!3m2!1ses!2sCL!4v00000000000"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}