import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistroUser } from "../../hooks/useRegistroUser";
import "../../styles/Registro.css";

type Props = {
  esAdmin?: boolean; // si es true, muestra selector de rol
};

export default function RegistroForm({ esAdmin = false }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    email: "",
    direccion: "",
    password: "",
    confirm: "",
    acepta: false,
    role: "vecino" as "vecino" | "admin",
  });

  const { errors, sending, registrarUsuario, setErrors } = useRegistroUser();
  const navigate = useNavigate();

  const onChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (errors.length) setErrors([]);
    };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const ok = await registrarUsuario(form, !esAdmin); 
  // 👆 Si es admin, NO mantiene la sesión

  if (ok) {
    alert("✅ ¡Usuario registrado con éxito!");
    navigate("/");
  }
};

  return (
    <div className="registro-card">
      <header className="registro-header">
        <h2>{esAdmin ? "Registro de Usuarios (Admin)" : "Registro de Vecinos"}</h2>
        <p>Crea una cuenta para usar los servicios de <b>Mi Barrio Digital</b>.</p>
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

      <form onSubmit={handleSubmit} className="registro-form" noValidate>
        <div className="grid-2">
          <div className="form-group">
            <label>Nombre completo</label>
            <input value={form.nombre} onChange={onChange("nombre")} />
          </div>
          <div className="form-group">
            <label>RUT</label>
            <input value={form.rut} onChange={onChange("rut")} />
          </div>
        </div>

        <div className="form-group">
          <label>Correo</label>
          <input type="email" value={form.email} onChange={onChange("email")} />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input value={form.direccion} onChange={onChange("direccion")} />
        </div>

        {esAdmin && (
          <div className="form-group">
            <label>Rol del usuario</label>
            <select value={form.role} onChange={onChange("role")}>
              <option value="vecino">Vecino</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        )}

        <div className="grid-2">
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={onChange("password")}
            />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={form.confirm}
              onChange={onChange("confirm")}
            />
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
          {sending ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}
