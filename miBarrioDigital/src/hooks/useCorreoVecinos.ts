import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/firebase/config";

export function useCorreoVecinos() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enviarCorreo = async (asunto: string, mensaje: string) => {
    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const functions = getFunctions(app);
      const sendMail = httpsCallable(functions, "enviarCorreoVecinos");

      const res: any = await sendMail({ asunto, mensaje });

      if (res?.data?.success) {
        setMsg("✔ Correos enviados correctamente");
      } else {
        setError("No se pudieron enviar los correos.");
      }
    } catch (err: any) {
      console.error("❌ Error enviando correo:", err);
      setError(err.message || "Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return { enviarCorreo, loading, msg, error };
}
