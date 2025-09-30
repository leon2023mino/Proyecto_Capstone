import "../styles/Certificados.css";
import { useState } from "react";

export default function Certificados() {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    tipo: "",
    motivo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({ nombre: "", rut: "", direccion: "", tipo: "", motivo: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación mínima (puedes mejorarla)
    if (!form.nombre || !form.rut || !form.direccion || !form.tipo) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    console.log("Solicitud enviada:", form);
    alert(`✅ Certificado de ${form.tipo} solicitado correctamente`);
    handleReset();
  };

  return (
    <div className="certificados-page">
      <div className="cert-card">
        <h2 className="cert-title">Solicitud de Certificados</h2>
        <p className="cert-subtitle">
          Completa el formulario para generar tu certificado de residencia, participación u otros documentos oficiales.
        </p>

        
        {/* Formulario */}
        <form className="certificado-form" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="field">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="input"
              placeholder="Ej: Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <small className="helper">Tal como aparece en tu cédula.</small>
          </div>

          {/* RUT */}
          <div className="field">
            <label htmlFor="rut">RUT</label>
            <input
              id="rut"
              name="rut"
              type="text"
              className="input"
              placeholder="11.111.111-1"
              value={form.rut}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dirección */}
          <div className="field col-span-2">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              className="input"
              placeholder="Calle, número, depto/casa, comuna"
              value={form.direccion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tipo de certificado */}
          <div className="field">
            <label htmlFor="tipo">Tipo de certificado</label>
            <select
              id="tipo"
              name="tipo"
              className="select"
              value={form.tipo}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona un tipo --</option>
              <option value="residencia">Residencia</option>
              <option value="participacion">Participación en proyectos</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {/* Motivo / Comentarios */}
          <div className="field col-span-2">
            <label htmlFor="motivo">Motivo / Comentarios (opcional)</label>
            <textarea
              id="motivo"
              name="motivo"
              className="textarea"
              rows={4}
              placeholder="Información adicional que ayude a emitir tu certificado..."
              value={form.motivo}
              onChange={handleChange}
            />
          </div>
        </form>

        <div className="divider" />

        {/* Acciones */}
        <div className="actions">
          <button type="submit" className="btn-primary" onClick={handleSubmit}>
            Solicitar
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Limpiar
          </button>
          <span className="badge">Gratis</span>
        </div>

        <div className="card-footer" style={{ marginTop: ".75rem" }}>
          Al enviar, aceptas el uso de tus datos para la emisión del certificado.
        </div>
      </div>
    </div>
  );
}