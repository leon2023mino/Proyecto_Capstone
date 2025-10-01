import "../../styles/Reservas.css";
import { useMemo, useState } from "react";

export default function Reservas() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    espacio: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    motivo: "",
  });

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      nombre: "",
      email: "",
      espacio: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
      motivo: "",
    });
  };

  const validate = () => {
    if (
      !form.nombre ||
      !form.email ||
      !form.espacio ||
      !form.fecha ||
      !form.horaInicio ||
      !form.horaFin
    )
      return "Completa todos los campos obligatorios.";

    // Validación simple de rango horario (HH:MM)
    if (form.horaFin <= form.horaInicio) {
      return "La hora de término debe ser posterior a la hora de inicio.";
    }

    // Fechas pasadas (solo bloquea fechas antes de hoy)
    if (form.fecha < today) {
      return "La fecha seleccionada no puede ser anterior a hoy.";
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

    console.log("Reserva enviada:", form);
    alert("✅ ¡Tu reserva ha sido enviada!");
    handleReset();
  };

  return (
    <div className="reservas-page">
      <div className="reserva-card">
        <h2 className="reserva-title">Reservas de Espacios Comunitarios</h2>
        <p className="reserva-subtitle">
          Completa el formulario para reservar la sede social, multicancha o
          sala de reuniones.
        </p>

        <form className="reserva-form" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="input"
              placeholder="Ej: Ana López"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              placeholder="ana@mail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Espacio */}
          <div className="field">
            <label htmlFor="espacio">Espacio</label>
            <select
              id="espacio"
              name="espacio"
              className="select"
              value={form.espacio}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona un espacio --</option>
              <option value="sede">Sede Social</option>
              <option value="cancha">Multicancha</option>
              <option value="sala">Sala de reuniones</option>
            </select>
          </div>

          {/* Fecha (col-span-2 para que se vea ancho en desktop) */}
          <div className="field col-span-2">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              className="input"
              min={today}
              value={form.fecha}
              onChange={handleChange}
              required
            />
            <small className="helper">
              No se permiten reservas en fechas pasadas.
            </small>
          </div>

          {/* Horarios */}
          <div className="time-row col-span-2">
            <div className="field">
              <label htmlFor="horaInicio">Hora inicio</label>
              <input
                id="horaInicio"
                name="horaInicio"
                type="time"
                className={`input ${
                  form.horaFin && form.horaFin <= form.horaInicio
                    ? "is-invalid"
                    : ""
                }`}
                value={form.horaInicio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="horaFin">Hora fin</label>
              <input
                id="horaFin"
                name="horaFin"
                type="time"
                className={`input ${
                  form.horaFin && form.horaFin <= form.horaInicio
                    ? "is-invalid"
                    : ""
                }`}
                value={form.horaFin}
                onChange={handleChange}
                required
              />
              {form.horaFin && form.horaFin <= form.horaInicio && (
                <small className="error">
                  La hora de término debe ser posterior a la de inicio.
                </small>
              )}
            </div>
          </div>

          {/* Motivo */}
          <div className="field col-span-2">
            <label htmlFor="motivo">Motivo de la reserva</label>
            <textarea
              id="motivo"
              name="motivo"
              className="textarea"
              rows={4}
              placeholder="Describe el motivo del uso del espacio..."
              value={form.motivo}
              onChange={handleChange}
              required
            />
          </div>
        </form>

        <div className="divider" />

        <div className="actions">
          <button type="submit" className="btn-primary" onClick={handleSubmit}>
            Reservar
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Limpiar
          </button>
          <span className="badge">Sin costo</span>
        </div>
      </div>
    </div>
  );
}
