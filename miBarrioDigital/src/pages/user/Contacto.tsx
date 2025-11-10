import "../../styles/Contacto.css";
import { useState } from "react";

type FormData = {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
};

export default function Contacto() {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  /** Manejar cambios en los campos */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" }); // limpia mensaje previo
  };

  /** Validación básica */
  const validate = (): string => {
    if (!form.nombre || !form.email || !form.mensaje)
      return "Por favor completa tu nombre, correo y mensaje.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "El correo no tiene un formato válido.";
    return "";
  };

  /** Simular envío */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMessage({ text: error, type: "error" });
      return;
    }

    setSending(true);
    try {
      // Aquí podrías integrar EmailJS, Firestore o API real
      await new Promise((res) => setTimeout(res, 800));
      console.log("📧 Mensaje enviado:", form);

      setMessage({
        text: "✅ ¡Tu mensaje fue enviado! Te responderemos pronto.",
        type: "success",
      });
      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
    } catch {
      setMessage({
        text: "❌ Ocurrió un error al enviar tu mensaje. Intenta nuevamente.",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-grid">
        {/* FORMULARIO PRINCIPAL */}
        <section className="contact-card">
          <h2 className="contact-title">Contáctanos</h2>
          <p className="contact-subtitle">
            Si tienes dudas, sugerencias o deseas comunicarte con la Junta de Vecinos,
            completa el formulario o usa los medios de contacto directo.
          </p>

          {message.text && (
            <div
              className={`contact-info-banner ${
                message.type === "success" ? "success" : "error"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="input"
                placeholder="Ej: María Pérez"
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
              <small className="helper">
                Sé claro y proporciona detalles para poder ayudarte mejor.
              </small>
            </div>

            <div className="actions">
              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() =>
                  setForm({ nombre: "", email: "", asunto: "", mensaje: "" })
                }
                disabled={sending}
              >
                Limpiar
              </button>
            </div>
          </form>
        </section>

        {/* INFORMACIÓN LATERAL */}
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
              <span className="contact-chip">Correo</span>
              <a href="mailto:contacto@mibarriodigital.cl">
                contacto@mibarriodigital.cl
              </a>
            </li>
          </ul>

          <div className="divider" />

          <h3>Ubicación</h3>
          <div className="map-box">
            <iframe
              title="Mapa Mi Barrio Digital"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.644418621998!2d-70.648!3d-33.437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI2JzEzLjIiUyA3MMKwMzgnNTMuMCJX!5e0!3m2!1ses!2sCL!4v00000000000"
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
