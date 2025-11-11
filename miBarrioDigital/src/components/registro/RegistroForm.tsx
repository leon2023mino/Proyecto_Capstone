import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistroUser } from "../../hooks/useRegistroUser";
import "../../styles/Registro.css";

type Props = {
  esAdmin?: boolean;
};

export default function RegistroForm({ esAdmin = false }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    email: "",
    calle: "",
    numero: "",
    comuna: "",
    password: "",
    confirm: "",
    acepta: false,
    role: "vecino" as "vecino" | "admin",
  });

  const { errors, sending, registrarUsuario, setErrors } = useRegistroUser();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // --- Validaciones ---
  const validarRut = (rutInput: string): boolean => {
    if (!rutInput) return false;
    const rut = rutInput.replace(/\./g, "").replace(/\s+/g, "").toUpperCase();
    if (!/^\d{7,8}-[\dK]$/.test(rut)) return false;

    const [cuerpo, dvIngresado] = rut.split("-");
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = suma % 11;
    const dvEsperado = 11 - resto;
    const dvFinal =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : String(dvEsperado);

    return dvFinal === dvIngresado;
  };

  const validarFormulario = (): string[] => {
    const errs: string[] = [];
    if (!form.nombre.trim()) errs.push("El nombre es obligatorio.");
    if (!validarRut(form.rut)) errs.push("El RUT no es válido.");
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.push("Correo inválido.");
    if (!form.calle.trim() || !form.numero.trim() || !form.comuna.trim())
      errs.push("La dirección debe estar completa.");
    if (!form.acepta) errs.push("Debes aceptar los términos.");

    if (esAdmin) {
      if (form.password.length < 8)
        errs.push("La contraseña debe tener al menos 8 caracteres.");
      if (form.password !== form.confirm)
        errs.push("Las contraseñas no coinciden.");
    }

    return errs;
  };

  // --- Envío del formulario ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validarFormulario();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const direccionCompleta = `${form.calle} ${form.numero}, ${form.comuna}`;
    const ok = await registrarUsuario(
      { ...form, direccion: direccionCompleta },
      !esAdmin
    );

    if (ok) navigate(esAdmin ? "/admin/usuarios" : "/");
  };

  // --- Manejo de cambios ---
  const onChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value: string | boolean =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;

      if (field === "rut" && typeof value === "string") {
        let limpio = value.replace(/[^0-9kK]/g, "").toUpperCase();
        if (limpio.length > 1) {
          const cuerpo = limpio.slice(0, -1);
          const dv = limpio.slice(-1);
          limpio = `${cuerpo}-${dv}`;
        }
        value = limpio;
      }

      setForm((f) => ({ ...f, [field]: value }));
      if (errors.length) setErrors([]);
    };

  const calcStrength = (pass: string): number => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[a-z]/.test(pass)) s++;
    if (/\d/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  // --- Render ---
  return (
    <div className="registro-card">
      <div className="registro-header">
        <h2>{esAdmin ? "Registrar Usuario" : "Registro de Vecino"}</h2>
        <p>
          {esAdmin
            ? "Completa los datos para crear una cuenta interna."
            : "Únete a Mi Barrio Digital y participa en tu comunidad."}
        </p>
      </div>

      {errors.length > 0 && (
        <div className="registro-alert">
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="registro-form">
        {/* Nombre y RUT */}
        <div className="grid-2">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              placeholder="Ej: María López"
              value={form.nombre}
              onChange={onChange("nombre")}
              required
            />
          </div>
          <div className="form-group">
            <label>RUT</label>
            <input
              placeholder="Ej: 12345678-9"
              value={form.rut}
              onChange={onChange("rut")}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={form.email}
            onChange={onChange("email")}
          />
        </div>

        {/* Dirección */}
        <div className="form-group">
          <label>Calle</label>
          <input
            placeholder="Nombre de calle"
            value={form.calle}
            onChange={onChange("calle")}
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Número</label>
            <input
              placeholder="Ej: 123"
              value={form.numero}
              onChange={onChange("numero")}
            />
          </div>
          <div className="form-group">
            <label>Comuna</label>
            <input
              placeholder="Ej: Ñuñoa"
              value={form.comuna}
              onChange={onChange("comuna")}
            />
          </div>
        </div>

        {/* Solo para admin */}
        {esAdmin && (
          <>
            <div className="grid-2">
              <div className="form-group password-field">
                <label>Contraseña</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  placeholder="Mínimo 8 caracteres"
                  onChange={onChange("password")}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
                <div className={`strength`}>
                  <div className={`bar s-${calcStrength(form.password)}`} />
                  <span className="strength-label">
                    {["Débil", "Débil", "Media", "Buena", "Fuerte"][
                      Math.min(calcStrength(form.password), 4)
                    ]}
                  </span>
                </div>
              </div>

              <div className="form-group password-field">
                <label>Confirmar contraseña</label>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={onChange("confirm")}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Rol</label>
              <select value={form.role} onChange={onChange("role")}>
                <option value="vecino">Vecino</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </>
        )}

        {/* Aceptar términos */}
        <label className="terms">
          <input
            type="checkbox"
            checked={form.acepta}
            onChange={onChange("acepta")}
          />
          Acepto los <a href="#">términos y condiciones</a>.
        </label>

        {/* Botón */}
        <button type="submit" className="btn-submit" disabled={sending}>
          {sending
            ? "Procesando..."
            : esAdmin
            ? "Crear Usuario"
            : "Enviar Solicitud"}
        </button>
      </form>

      {!esAdmin && (
        <div className="registro-footer">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="link-strong">
            Inicia sesión aquí
          </a>
        </div>
      )}
    </div>
  );
}
