import "../styles/Reservas.css";
import { useState } from "react";

export default function Reservas() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    espacio: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    motivo: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reserva enviada:", form);
    alert("¡Tu reserva ha sido enviada!");
    setForm({ nombre: "", email: "", espacio: "", fecha: "", horaInicio: "", horaFin: "", motivo: "" });
  };

  return (
    <div className="reservas-page">
      <h2>Reservas de Espacios Comunitarios</h2>
      <p>Completa el formulario para reservar la sede social, multicancha o sala de reuniones.</p>

      {/* Formulario */}
      <form className="reserva-form" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>

        <label>
          Correo electrónico:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Espacio:
          <select name="espacio" value={form.espacio} onChange={handleChange} required>
            <option value="">-- Selecciona un espacio --</option>
            <option value="sede">Sede Social</option>
            <option value="cancha">Multicancha</option>
            <option value="sala">Sala de reuniones</option>
          </select>
        </label>

        <label>
          Fecha:
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        </label>

        <div className="horas">
          <label>
            Hora inicio:
            <input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} required />
          </label>
          <label>
            Hora fin:
            <input type="time" name="horaFin" value={form.horaFin} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Motivo de la reserva:
          <textarea name="motivo" value={form.motivo} onChange={handleChange} rows={4} required />
        </label>

        <button type="submit" className="btn-enviar">Reservar</button>
      </form>
    </div>
  );
}