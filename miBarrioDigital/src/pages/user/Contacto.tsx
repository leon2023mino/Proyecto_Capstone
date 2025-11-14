import "../../styles/Contacto.css";
import { useState } from "react";
import { Mail, User, MessageSquare, Phone, MapPin } from "lucide-react";

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
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });

  /** Manejar cambios */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  /** Validar */
  const validate = (): string => {
    if (!form.nombre || !form.email || !form.mensaje)
      return "Completa tu nombre, correo y mensaje.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "El correo no tiene un formato válido.";
    return "";
  };

  /** Enviar */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMessage({ text: error, type: "error" });
      return;
    }

    setSending(true);
    try {
      // simula envío real (emailJS, firestore, backend, etc.)
      await new Promise((res) => setTimeout(res, 900));

      setMessage({
        text: "Mensaje enviado correctamente. Te responderemos pronto.",
        type: "success",
      });

      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
    } catch {
      setMessage({
        text: "Ocurrió un error al enviar el mensaje. Inténtalo más tarde.",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-grid">
        {/* FORMULARIO */}
        <section className="contact-card">
          <h2 className="contact-title">Contáctanos</h2>
          <p className="contact-subtitle">
            Estamos aquí para ayudarte. Completa el formulario y nos comunicaremos
            contigo a la brevedad.
          </p>

          {message.text && (
            <div
              className={`contact-banner ${
                message.type === "success" ? "success" : "error"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="nombre">
                <User className="icon" /> Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: María Pérez"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="email">
                <Mail className="icon" /> Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="asunto">
                <MessageSquare className="icon" /> Asunto (opcional)
              </label>
              <input
                id="asunto"
                name="asunto"
                type="text"
                placeholder="Consulta, sugerencia, reclamo..."
                value={form.asunto}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="mensaje">
                <MessageSquare className="icon" /> Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                placeholder="Escribe aquí tu mensaje..."
                rows={5}
                value={form.mensaje}
                onChange={handleChange}
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn-blue" disabled={sending}>
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>
              <button
                type="button"
                className="btn-blue-outline"
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

        {/* LATERAL */}
        <aside className="contact-sidebar">
          <h3>Información de contacto</h3>

          <ul className="contact-list">
            <li>
              <MapPin className="icon-sm" />
              <span>Calle Principal 123, Barrio</span>
            </li>
            <li>
              <Phone className="icon-sm" />
              <a href="tel:+56912345678">+56 9 1234 5678</a>
            </li>
            <li>
              <Mail className="icon-sm" />
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
