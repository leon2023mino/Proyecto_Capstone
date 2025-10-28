import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function ExportCertificado() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [generando, setGenerando] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setProfile({
          nombre: user.displayName ?? snap.data()?.nombre ?? "",
          email: user.email ?? snap.data()?.email ?? "",
          rut: snap.data()?.rut ?? "",
          direccion: snap.data()?.direccion ?? "",
          comuna: snap.data()?.comuna ?? "",
          fechaResidencia: snap.data()?.fechaResidencia ?? "",
          ...snap.data(),
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setProfile({ nombre: user.displayName ?? "", email: user.email ?? "" });
      }
    };
    fetchProfile();
  }, [user]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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

  if (loading) return null;

  return (
    <div style={{ maxWidth: 980, margin: "2rem auto", padding: "1rem" }}>
      {/* Vista previa (visible) */}
      <div
        ref={printRef}
        aria-label="Vista previa del certificado"
        style={{
          background: "#fff",
          padding: 28,
          borderRadius: 10,
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          color: "#111",
          fontFamily: "Helvetica, Arial, sans-serif",
          lineHeight: 1.45,
          marginBottom: 16,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0 }}>CERTIFICADO DE RESIDENCIA</h2>
          <small style={{ color: "#555" }}>Mi Barrio Digital</small>
        </div>

        <p style={{ textAlign: "justify", marginTop: 20 }}>
          A quien corresponda:
        </p>

        <p style={{ textAlign: "justify" }}>
          Certifico que <strong>{profile?.nombre ?? "—"}</strong>, RUT:{" "}
          <strong>{profile?.rut ?? "—"}</strong>, domiciliado(a) en{" "}
          <strong>{profile?.direccion ?? "—"}</strong>, comuna de{" "}
          <strong>{profile?.comuna ?? "—"}</strong>, se encuentra habitando en
          el domicilio indicado y reside habitualmente en el mismo.
        </p>

        <p style={{ textAlign: "justify" }}>
          El presente certificado se expide a solicitud del interesado para los
          fines que estime convenientes.
        </p>

        <p style={{ marginTop: 24 }}>
          Lugar: <strong>{profile?.comuna ?? "—"}</strong> — Fecha:{" "}
          <strong>{formatDate(new Date())}</strong>
        </p>

        <div style={{ marginTop: 40 }}>
          <p>Atentamente,</p>
          <p style={{ marginTop: 48 }}>
            <strong>Mi Barrio Digital</strong>
          </p>
          <p style={{ color: "#666", fontSize: 12 }}>
            Este documento fue generado electrónicamente y no requiere firma
            física.
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={handleExportPdf}
          disabled={!user || generando}
          className="btn"
          title={
            user
              ? "Descargar certificado de residencia"
              : "Debes iniciar sesión"
          }
          style={{
            padding: ".6rem 1rem",
            background: "var(--brand-blue, #0b6d44)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {generando
            ? "Generando..."
            : user
            ? "Descargar Certificado"
            : "Inicia sesión para descargar"}
        </button>

        <button
          onClick={() => {
            // Abrir vista previa en nueva ventana imprenta-libre como alternativa
            if (!printRef.current) return;
            const html = printRef.current.outerHTML;
            const newWin = window.open("", "_blank", "noopener,noreferrer");
            if (!newWin) return;
            newWin.document.write(
              `<html><head><title>Preview</title></head><body>${html}</body></html>`
            );
            newWin.document.close();
          }}
          className="btn"
          style={{
            padding: ".6rem 1rem",
            background: "#f3f3f3",
            color: "#111",
            border: "1px solid #e6e6e6",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
          title="Abrir vista previa en nueva ventana"
        >
          Abrir vista previa
        </button>
      </div>
    </div>
  );
}
