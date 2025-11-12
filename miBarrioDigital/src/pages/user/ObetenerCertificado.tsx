import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

export default function ExportCertificado() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [generando, setGenerando] = useState(false);
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [estadoSolicitud, setEstadoSolicitud] = useState<
    "pendiente" | "aprobada" | "rechazada" | null
  >(null);
  const printRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Cargar perfil del usuario
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : {};

        // Separar dirección y comuna
        let direccionLimpia = data?.direccion || "";
        let comunaExtraida = data?.comuna || "";
        if (direccionLimpia.includes(",")) {
          const partes = direccionLimpia.split(",");
          direccionLimpia = partes[0].trim();
          comunaExtraida = partes[1]?.trim() || comunaExtraida;
        }

        setProfile({
          nombre:
            data?.nombre ||
            data?.displayName ||
            user.displayName ||
            "Usuario sin nombre",
          email: data?.email || user.email || "",
          rut: data?.rut || "",
          direccion: direccionLimpia,
          comuna: comunaExtraida,
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    };

    fetchProfile();
  }, [user]);

  // 🔹 Verificar solicitud existente
  useEffect(() => {
    if (!user) return;

    const verificarSolicitud = async () => {
      const q = query(
        collection(db, "requests"),
        where("usuarioId", "==", user.uid),
        where("tipo", "==", "certificado")
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setEstadoSolicitud(null);
      } else {
        const docData = snap.docs[0].data();
        setEstadoSolicitud(docData.estado);
      }
    };

    verificarSolicitud();
  }, [user]);

  // 🔹 Crear solicitud
  const solicitarCertificado = async () => {
    if (!user || !profile) {
      alert("Debes iniciar sesión para solicitar el certificado.");
      return;
    }

    try {
      const ref = doc(db, "requests", `${user.uid}_certificado`);
      await setDoc(ref, {
        tipo: "certificado",
        usuarioId: user.uid,
        estado: "pendiente",
        createdAt: serverTimestamp(),
        datos: {
          nombre: profile.nombre,
          rut: profile.rut,
          email: profile.email,
          direccion: profile.direccion,
          comuna: profile.comuna,
        },
      });

      setEstadoSolicitud("pendiente");
      alert("✅ Solicitud enviada. Espera aprobación del administrador.");
    } catch (err) {
      console.error("Error creando solicitud:", err);
      alert("❌ No se pudo enviar la solicitud.");
    }
  };

  // 🔹 Generar PDF y subirlo a Firebase Storage
  const generarYSubirPDF = async (): Promise<string | null> => {
    if (!user || !printRef.current) return null;

    try {
      setGenerando(true);

      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = (pdf as any).getImageProperties(imgData);
      const imgWidthMM = pageWidth - 20;
      const imgHeightMM = (imgProps.height * imgWidthMM) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidthMM, imgHeightMM);

      const pdfBase64 = pdf.output("datauristring");

      // 🔹 Subir a Firebase Storage
      const storage = getStorage();
      const pdfRef = ref(storage, `certificados/${user.uid}/certificado.pdf`);
      await uploadString(pdfRef, pdfBase64, "data_url");
      const url = await getDownloadURL(pdfRef);

      return url;
    } catch (err) {
      console.error("Error generando/subiendo PDF:", err);
      return null;
    } finally {
      setGenerando(false);
    }
  };

  // 🔹 Enviar correo con link de descarga
  const enviarPorCorreo = async () => {
    if (!user || !profile?.email) {
      alert("Debes iniciar sesión o no se encontró correo del usuario.");
      return;
    }

    setEnviandoCorreo(true);
    try {
      const pdfURL = await generarYSubirPDF();
      if (!pdfURL) throw new Error("No se pudo generar el PDF.");

      await emailjs.send(
        "service_zb7okuy", // ID de tu servicio
        "template_omb49ft", // ID de tu template
        {
          to_name: profile.nombre,
          to_email: profile.email,
          message:
            "Tu certificado de residencia ya está disponible. Puedes descargarlo usando el enlace siguiente:",
          download_link: pdfURL,
        },
        "l9YawRC9IuAKvTD_9" // tu public key
      );

      alert(`📨 Certificado enviado exitosamente a ${profile.email}`);
    } catch (err) {
      console.error("Error enviando correo:", err);
      alert("❌ No se pudo enviar el correo.");
    } finally {
      setEnviandoCorreo(false);
    }
  };

  // 🔹 Descargar localmente (opcional)
  const handleExportPdf = async () => {
    if (!user || !printRef.current) return;
    setGenerando(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = (pdf as any).getImageProperties(imgData);
      const imgWidthMM = pageWidth - 20;
      const imgHeightMM = (imgProps.height * imgWidthMM) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidthMM, imgHeightMM);
      pdf.save(`certificado_residencia_${user.uid}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
    } finally {
      setGenerando(false);
    }
  };

  // 🔹 Fecha formateada
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: 980, margin: "2rem auto", padding: "1rem" }}>
      {/* Vista previa del certificado */}
      <div
        ref={printRef}
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 10,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          color: "#111",
          fontFamily: "Helvetica, Arial, sans-serif",
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="/logopngpes.png"
            alt="Mi Barrio Digital"
            style={{ height: 90, marginBottom: 10 }}
          />
          <h2 style={{ margin: 0, color: "#1b56a4" }}>
            CERTIFICADO DE RESIDENCIA
          </h2>
          <small style={{ color: "#555" }}>Emitido por Mi Barrio Digital</small>
        </div>

        <p style={{ textAlign: "justify", marginTop: 20 }}>A quien corresponda:</p>

        <p style={{ textAlign: "justify" }}>
          Certifico que <strong>{profile?.nombre || "—"}</strong>, RUT:{" "}
          <strong>{profile?.rut || "—"}</strong>, domiciliado(a) en{" "}
          <strong>{profile?.direccion || "—"}</strong>, comuna de{" "}
          <strong>{profile?.comuna || "—"}</strong>, se encuentra habitando en el
          domicilio indicado y reside habitualmente en el mismo.
        </p>

        <p style={{ textAlign: "justify" }}>
          El presente certificado se expide a solicitud del interesado para los
          fines que estime convenientes.
        </p>

        <p style={{ marginTop: 30 }}>
          Lugar: <strong>{profile?.comuna || "—"}</strong> — Fecha:{" "}
          <strong>{formatDate(new Date())}</strong>
        </p>

        <div style={{ marginTop: 60, textAlign: "center" }}>
          <p>Atentamente,</p>
          <p style={{ marginTop: 45, fontWeight: 700, fontSize: "1.05rem" }}>
            Mi Barrio Digital
          </p>
          <p style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
            Este documento fue generado electrónicamente y no requiere firma
            física.
          </p>
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {estadoSolicitud === null && (
          <button
            onClick={solicitarCertificado}
            style={{
              padding: ".7rem 1.3rem",
              background: "#1b56a4",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Solicitar Certificado
          </button>
        )}

        {estadoSolicitud === "pendiente" && (
          <button
            disabled
            style={{
              padding: ".7rem 1.3rem",
              background: "#c78300",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "not-allowed",
              fontWeight: 600,
            }}
          >
            🕓 Solicitud pendiente
          </button>
        )}

        {estadoSolicitud === "rechazada" && (
          <button
            onClick={solicitarCertificado}
            style={{
              padding: ".7rem 1.3rem",
              background: "#c73f3f",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ❌ Rechazada — reenviar solicitud
          </button>
        )}

        {estadoSolicitud === "aprobada" && (
          <>
            <button
              onClick={handleExportPdf}
              disabled={generando}
              style={{
                padding: ".7rem 1.3rem",
                background: "#57b460",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {generando ? "Generando..." : "⬇️ Descargar Certificado"}
            </button>

            <button
              onClick={enviarPorCorreo}
              disabled={enviandoCorreo}
              style={{
                padding: ".7rem 1.3rem",
                background: "#1b56a4",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {enviandoCorreo ? "Enviando..." : "📧 Enviar por correo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
