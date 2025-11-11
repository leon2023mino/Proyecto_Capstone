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
      !esAdmin // 👈 si es admin → false (crear cuenta directa); si es usuario → true (solo solicitud)
    );

    if (ok) navigate(esAdmin ? "/admin/usuarios" : "/");
  };

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

  return (
    <div className="registro-card">
      <h2>{esAdmin ? "Registrar Usuario (Admin)" : "Registro de Vecino"}</h2>
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
        <div className="grid-2">
          <div>
            <label>Nombre completo</label>
            <input value={form.nombre} onChange={onChange("nombre")} required />
          </div>
          <div>
            <label>RUT</label>
            <input value={form.rut} onChange={onChange("rut")} required />
          </div>
        </div>

        <label>Correo</label>
        <input type="email" value={form.email} onChange={onChange("email")} />

        <div className="grid-3">
          <input
            placeholder="Calle"
            value={form.calle}
            onChange={onChange("calle")}
          />
          <input
            placeholder="Número"
            value={form.numero}
            onChange={onChange("numero")}
          />
          <input
            placeholder="Comuna"
            value={form.comuna}
            onChange={onChange("comuna")}
          />
        </div>

        {esAdmin && (
          <>
            <div className="grid-2">
              <input
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={onChange("password")}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={form.confirm}
                onChange={onChange("confirm")}
              />
            </div>
            <select value={form.role} onChange={onChange("role")}>
              <option value="vecino">Vecino</option>
              <option value="admin">Administrador</option>
            </select>
          </>
        )}

        <label className="terms">
          <input
            type="checkbox"
            checked={form.acepta}
            onChange={onChange("acepta")}
          />
          Acepto los <a href="#">términos y condiciones</a>.
        </label>

        <button type="submit" disabled={sending}>
          {sending
            ? "Procesando..."
            : esAdmin
            ? "Crear Usuario"
            : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  );
}
