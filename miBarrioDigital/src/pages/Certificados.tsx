import "../App.css";
import { useState } from "react";

export default function Certificados() {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    tipo: "",
    motivo: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Solicitud enviada:", form);
    alert(`Certificado de ${form.tipo} solicitado correctamente`);
    setForm({ nombre: "", rut: "", direccion: "", tipo: "", motivo: "" });
  };

  return (
    <div className="certificados-page">
      <h2>Solicitud de Certificados</h2>
      <p>
        Completa el siguiente formulario para generar tu certificado de residencia,
        participación u otros documentos oficiales emitidos por la Junta de Vecinos.
      </p>

      {/* Formulario de solicitud */}
      <form className="certificado-form" onSubmit={handleSubmit}>
        <label>
          Nombre completo:
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>

        <label>
          RUT:
          <input type="text" name="rut" value={form.rut} onChange={handleChange} required />
        </label>

        <label>
          Dirección:
          <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required />
        </label>

        <label>
          Tipo de certificado:
          <select name="tipo" value={form.tipo} onChange={handleChange} required>
            <option value="">-- Selecciona un tipo --</option>
            <option value="residencia">Residencia</option>
            <option value="participacion">Participación en proyectos</option>
            <option value="otros">Otros</option>
          </select>
        </label>

        <label>
          Motivo / Comentarios:
          <textarea name="motivo" value={form.motivo} onChange={handleChange} rows={4} />
        </label>

        <button type="submit" className="btn-enviar">Solicitar</button>
      </form>
    </div>
  );
}