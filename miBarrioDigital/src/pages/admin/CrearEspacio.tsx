import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import "../../styles/CrearEspacio.css";

type NuevoEspacio = {
  nombre: string;
  tipo: string;
  aforo: number | "";
  ubicacion: string;
  activo: boolean;
};

export default function CrearEspacio() {
  const [espacio, setEspacio] = useState<NuevoEspacio>({
    nombre: "",
    tipo: "",
    aforo: "",
    ubicacion: "",
    activo: true,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // ✅ Validaciones de formulario
  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!espacio.nombre.trim())
      nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!espacio.tipo.trim())
      nuevosErrores.tipo = "Selecciona un tipo de espacio.";
    if (espacio.aforo === "" || espacio.aforo <= 0)
      nuevosErrores.aforo = "Ingresa un aforo válido (mayor a 0).";
    if (!espacio.ubicacion.trim())
      nuevosErrores.ubicacion = "La ubicación es obligatoria.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ✅ Manejar cambios de campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // 🔹 Si es checkbox
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setEspacio((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setEspacio((prev) => ({
        ...prev,
        [name]: name === "aforo" ? Number(value) : value,
      }));
    }

    // 🔹 Limpiar error cuando se corrige el campo
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!validarFormulario()) return;

    setEnviando(true);

    try {
      await addDoc(collection(db, "spaces"), espacio);
      setMensaje("✅ Espacio creado correctamente.");

      // 🔹 Reiniciar formulario
      setEspacio({
        nombre: "",
        tipo: "",
        aforo: "",
        ubicacion: "",
        activo: true,
      });
    } catch (error) {
      console.error("Error al crear espacio:", error);
      setMensaje("❌ Hubo un error al crear el espacio.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="crear-espacio-page">
      <header>
        <h2>Crear Nuevo Espacio</h2>
        <p>Completa los campos para registrar un nuevo espacio comunitario.</p>
      </header>

      <form onSubmit={handleSubmit} className="crear-espacio-form" noValidate>
        {/* Nombre */}
        <div className={`form-field ${errores.nombre ? "error" : ""}`}>
          <label htmlFor="nombre">Nombre del espacio *</label>
          <input
            id="nombre"
            name="nombre"
            value={espacio.nombre}
            onChange={handleChange}
            placeholder="Ej: Sala Multiuso"
          />
          {errores.nombre && <small className="error-text">{errores.nombre}</small>}
        </div>

        {/* Tipo */}
        <div className={`form-field ${errores.tipo ? "error" : ""}`}>
          <label htmlFor="tipo">Tipo de espacio *</label>
          <select
            id="tipo"
            name="tipo"
            value={espacio.tipo}
            onChange={handleChange}
          >
            <option value="">Selecciona tipo...</option>
            <option value="Sala">Sala</option>
            <option value="Cancha">Cancha</option>
            <option value="Sede Social">Sede Social</option>
            <option value="Otro">Otro</option>
          </select>
          {errores.tipo && <small className="error-text">{errores.tipo}</small>}
        </div>

        {/* Aforo */}
        <div className={`form-field ${errores.aforo ? "error" : ""}`}>
          <label htmlFor="aforo">Aforo máximo *</label>
          <input
            id="aforo"
            name="aforo"
            type="number"
            min={1}
            value={espacio.aforo}
            onChange={handleChange}
            placeholder="Ej: 50"
          />
          {errores.aforo && <small className="error-text">{errores.aforo}</small>}
        </div>

        {/* Ubicación */}
        <div className={`form-field ${errores.ubicacion ? "error" : ""}`}>
          <label htmlFor="ubicacion">Ubicación *</label>
          <input
            id="ubicacion"
            name="ubicacion"
            value={espacio.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Calle Los Robles 123"
          />
          {errores.ubicacion && (
            <small className="error-text">{errores.ubicacion}</small>
          )}
        </div>

        {/* Activo */}
        <div className="form-check">
          <input
            type="checkbox"
            id="activo"
            name="activo"
            checked={espacio.activo}
            onChange={handleChange}
          />
          <label htmlFor="activo">Espacio activo</label>
        </div>

        {/* Mensaje */}
        {mensaje && <div className="mensaje">{mensaje}</div>}

        <div className="acciones">
          <button type="submit" disabled={enviando}>
            {enviando ? "Creando..." : "Crear Espacio"}
          </button>
        </div>
      </form>
    </div>
  );
}
