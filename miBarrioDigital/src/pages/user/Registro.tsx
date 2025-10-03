import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/config"; // 👈 ajusta si tu ruta difiere
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

function normalizarRut(rut: string) {
  return rut.trim().replace(/\./g, "").toUpperCase(); // sin puntos; K mayúscula
}

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
  const navigate = useNavigate();

  const onChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!form.acepta) errs.push("Debes aceptar los términos y condiciones.");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (v.length) return;

    setSending(true);
    try {
      // 1) Crear cuenta en Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      // 2) Actualizar displayName en Auth (opcional)
      await updateProfile(cred.user, { displayName: form.nombre.trim() });

      // 3) Crear perfil extendido en Firestore: users/{uid}
      await setDoc(doc(db, "users", cred.user.uid), {
        displayName: form.nombre.trim(),
        email: form.email.trim(),
        rut: normalizarRut(form.rut),
        address: form.direccion.trim() || null,
        phone: null, // si luego agregas teléfono en este formulario, cámbialo
        uv: null, // idem si agregas UV
        role: "vecino",
        membershipStatus: "pendiente",
        createdAt: serverTimestamp(),
      });

      // 4) (Opcional) Verificación de email
      try {
        await sendEmailVerification(cred.user);
      } catch {}

      // 5) Feedback + redirección
      alert("✅ ¡Cuenta creada! Revisa tu correo para verificar la cuenta.");
      setForm({
        nombre: "",
        rut: "",
        email: "",
        direccion: "",
        password: "",
        confirm: "",
        acepta: false,
      });
      navigate("/"); // o "/login" si prefieres que inicie sesión luego de verificar
    } catch (err: any) {
      // Mapeo de errores comunes
      const map: Record<string, string> = {
        "auth/email-already-in-use": "El correo ya está en uso.",
        "auth/invalid-email": "Correo inválido.",
        "auth/weak-password":
          "La contraseña es muy débil (mínimo 6 caracteres).",
        "auth/operation-not-allowed":
          "Método de registro no habilitado en Firebase.",
      };
      setErrors([map[err?.code] ?? "No se pudo crear la cuenta."]);
      console.error(err);
    } finally {
      setSending(false);
    }
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

        {/* 👇 Mantengo tu mismo form y clases, solo llamo a handleSubmit */}
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
                  aria-label={
                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="strength">
                <div className={`bar s-${passwordStrength}`} />
                <span className="strength-label">
                  {
                    ["Muy débil", "Débil", "Medio", "Fuerte", "Muy fuerte"][
                      passwordStrength
                    ]
                  }
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
                  aria-label={
                    showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
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
