import { NavLink } from "react-router-dom";

export default function ElegirTipoCertificado() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 text-center">
        
        {/* Título */}
        <h1 className="text-2xl font-extrabold text-[#0f3d91] mb-2">
          Seleccionar certificado
        </h1>

        <p className="text-gray-600 mb-8">
          Elige el tipo de certificado que deseas obtener.
        </p>

        {/* Opción */}
        <div className="flex flex-col items-center gap-4 w-full">
          <NavLink to="/ObetenerCertificado" className="w-full">
            <button
              className="w-full bg-[#0f3d91] hover:bg-[#0d347c] text-white font-semibold py-3 rounded-lg transition"
            >
              Obtener certificado
            </button>
          </NavLink>
        </div>

      </div>
    </div>
  );
}
