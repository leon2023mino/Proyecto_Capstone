// src/pages/admin/RegistroForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useRegistroUser } from "../../hooks/useRegistroUser";

export default function RegistroForm({ esAdmin = false }: { esAdmin?: boolean }) {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    email: "",
    celular: "",
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
    if (!/^\+?\d{8,15}$/.test(form.celular))
      errs.push("Número de celular inválido (ej: +56912345678).");
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
      !esAdmin
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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#0f3d91] mb-2">
        {esAdmin ? "Registrar Usuario" : "Registro de Vecino"}
      </h2>
      <p className="text-gray-500 mb-5">
        {esAdmin
          ? "Completa los datos para crear una cuenta interna."
          : "Únete a Mi Barrio Digital y participa en tu comunidad."}
      </p>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
          <ul className="list-disc ml-5 text-sm">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y RUT */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-800">Nombre completo</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
              value={form.nombre}
              onChange={onChange("nombre")}
              placeholder="Ej: María López"
              required
            />
          </div>
          <div>
            <label className="font-semibold text-gray-800">RUT</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
              value={form.rut}
              onChange={onChange("rut")}
              placeholder="12345678-9"
              required
            />
          </div>
        </div>

        {/* Email y Celular */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-800">Correo electrónico</label>
            <input
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="tucorreo@ejemplo.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-800">Número de celular</label>
            <input
              type="tel"
              value={form.celular}
              onChange={onChange("celular")}
              placeholder="+56912345678"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
            />
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="font-semibold text-gray-800">Calle</label>
          <input
            value={form.calle}
            onChange={onChange("calle")}
            placeholder="Ej: Av. Los Olivos"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-800">Número</label>
            <input
              value={form.numero}
              onChange={onChange("numero")}
              placeholder="123"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-800">Comuna</label>
            <input
              value={form.comuna}
              onChange={onChange("comuna")}
              placeholder="Ej: Ñuñoa"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
            />
          </div>
        </div>

        {/* Contraseñas (solo admin) */}
        {esAdmin && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="font-semibold text-gray-800">Contraseña</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={onChange("password")}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#0f3d91]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-[#0f3d91]"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <label className="font-semibold text-gray-800">Confirmar contraseña</label>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={onChange("confirm")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-[#0f3d91]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-[#0f3d91]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-800">Rol</label>
              <select
                value={form.role}
                onChange={onChange("role")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f3d91]"
              >
                <option value="vecino">Vecino</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </>
        )}

        {/* Términos */}
        <label className="flex items-center gap-2 text-gray-600 text-sm">
          <input
            type="checkbox"
            checked={form.acepta}
            onChange={onChange("acepta")}
            className="h-4 w-4 border-gray-300 rounded text-[#0f3d91] focus:ring-[#0f3d91]"
          />
          Acepto los{" "}
          <a href="#" className="text-[#0f3d91] font-semibold hover:underline">
            términos y condiciones
          </a>
          .
        </label>

        {/* Botón */}
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-[#0f3d91] text-white font-semibold py-2.5 rounded-full hover:bg-[#0d347e] transition disabled:opacity-60"
        >
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
