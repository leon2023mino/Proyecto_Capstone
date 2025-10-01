import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/Registro.css";

type FormState = {
  nombre: string;
  rut: string;
  email: string;
  direccion: string;
  password: string;
  confirm: string;
  acepta: boolean;
};

export default function Registro() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    rut: "",
    email: "",
    direccion: "",
    password: "",
    confirm: "",
    acepta: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const onChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((f) => ({ ...f, [field]: value as any }));
    };

  const passwordStrength = (() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 4); // 0..4
  })();

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.nombre.trim()) errs.push("El nombre es obligatorio.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.push("Correo inválido.");
    if (!form.rut.trim()) errs.push("El RUT es obligatorio.");
    if (form.password.length < 8)
      errs.push("La contraseña debe tener al menos 8 caracteres.");
    if (form.password !== form.confirm)
      errs.push("Las contraseñas no coinciden.");
    if (!form.acepta)
      errs.push("Debes aceptar los términos y condiciones.");
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (v.length) return;
    setSending(true);
    // Aquí conectarás con tu backend
    console.log("Registrando usuario:", form);
    setTimeout(() => {
      setSending(false);
      alert("¡Registro enviado! Revisa tu correo para confirmar la cuenta.");
      setForm({
        nombre: "",
        rut: "",
        email: "",
        direccion: "",
        password: "",
        confirm: "",
        acepta: false,
      });
    }, 700);
  };

  return (
    <div className="registro-page">
      <div className="registro-card">
        <header className="registro-header">
          <h2>Registro de Vecinos</h2>
          <p>
            Crea tu cuenta para usar certificados, reservas y más en{" "}
            <b>Mi Barrio Digital</b>.
          </p>
        </header>

        {errors.length > 0 && (
          <div className="registro-alert" role="alert">
            <ul>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="registro-form" onSubmit={handleSubmit} noValidate>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={onChange("nombre")}
                placeholder="Ej: Juan Pérez"
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rut">RUT</label>
              <input
                id="rut"
                type="text"
                value={form.rut}
                onChange={onChange("rut")}
                placeholder="12.345.678-9"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="correo@ejemplo.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              type="text"
              value={form.direccion}
              onChange={onChange("direccion")}
              placeholder="Calle, número, comuna"
              autoComplete="street-address"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={onChange("password")}
                  placeholder="********"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="strength">
                <div className={`bar s-${passwordStrength}`} />
                <span className="strength-label">
                  {["Muy débil", "Débil", "Medio", "Fuerte", "Muy fuerte"][passwordStrength]}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirmar contraseña</label>
              <div className="password-field">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={onChange("confirm")}
                  placeholder="********"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <label className="terms">
            <input
              type="checkbox"
              checked={form.acepta}
              onChange={onChange("acepta")}
            />
            Acepto los <a href="#">términos y condiciones</a>.
          </label>

          <button type="submit" className="btn-submit" disabled={sending}>
            {sending ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <footer className="registro-footer">
          <span>¿Ya tienes cuenta?</span>{" "}
          <NavLink to="/login" className="link-strong">
            Inicia sesión
          </NavLink>
        </footer>
      </div>
    </div>
  );
}