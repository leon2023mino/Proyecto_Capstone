import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/config";
import "../../styles/AdministrarEspacios.css";

export default function EditarEspacio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [espacio, setEspacio] = useState<any>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  // 🔹 Cargar datos del espacio al montar el componente
  useEffect(() => {
    const fetchEspacio = async () => {
      if (!id) return;
      const ref = doc(db, "spaces", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setEspacio(snap.data());
      else alert("Espacio no encontrado");
    };
    fetchEspacio();
  }, [id]);

  // 🔹 Actualizar valores del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEspacio({ ...espacio, [e.target.name]: e.target.value });
  };

  // 🔹 Selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImagenFile(e.target.files[0]);
  };

  // 🔹 Guardar cambios en Firestore y Storage
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !espacio) return;

    setGuardando(true);
    try {
      let imageUrl = espacio.imagen || "";
      if (imagenFile) {
        const storage = getStorage();
        const fileRef = ref(storage, `espacios/${imagenFile.name}_${Date.now()}`);
        await uploadBytes(fileRef, imagenFile);
        imageUrl = await getDownloadURL(fileRef);
      }

      const refDoc = doc(db, "spaces", id);
      await updateDoc(refDoc, {
        nombre: espacio.nombre,
        tipo: espacio.tipo,
        aforo: Number(espacio.aforo),
        ubicacion: espacio.ubicacion,
        imagen: imageUrl,
      });

      alert("✅ Espacio actualizado correctamente");
      navigate("/admin/AdministrarEspacios"); // ✅ Redirección al panel admin
    } catch (err) {
      console.error("Error actualizando:", err);
      alert("❌ No se pudo actualizar el espacio");
    } finally {
      setGuardando(false);
    }
  };

  if (!espacio) return <p style={{ textAlign: "center" }}>Cargando espacio...</p>;

  return (
    <div className="crear-espacio-page">
      <h2>Editar espacio</h2>

      {guardando && (
        <p style={{ textAlign: "center", color: "#1b56a4", fontWeight: 600 }}>
          Guardando cambios, por favor espera...
        </p>
      )}

      <form onSubmit={handleSave} className="crear-espacio-form">
        <label>
          Nombre:
          <input name="nombre" value={espacio.nombre} onChange={handleChange} />
        </label>

        <label>
          Tipo:
          <input name="tipo" value={espacio.tipo} onChange={handleChange} />
        </label>

        <label>
          Aforo:
          <input
            type="number"
            name="aforo"
            value={espacio.aforo}
            onChange={handleChange}
          />
        </label>

        <label>
          Ubicación:
          <input
            name="ubicacion"
            value={espacio.ubicacion}
            onChange={handleChange}
          />
        </label>

        <label>
          Cambiar imagen:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {/* Vista previa de imágenes */}
        {espacio.imagen && !imagenFile && (
          <img
            src={espacio.imagen}
            alt="Espacio actual"
            style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
          />
        )}

        {imagenFile && (
          <img
            src={URL.createObjectURL(imagenFile)}
            alt="Vista previa"
            style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
          />
        )}

        {/* Botones */}
        <div style={{ marginTop: "1rem" }}>
          <button
            type="submit"
            disabled={guardando}
            style={{
              background: "#57b460",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: guardando ? "not-allowed" : "pointer",
            }}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/AdministrarEspacios")}
            style={{
              marginLeft: "10px",
              background: "#ccc",
              color: "#000",
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}
