import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AtSign } from "lucide-react";

export default function EnviarCorreo() {
  const { user } = useAuth();
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const functions = getFunctions();
  const enviarCorreoFn = httpsCallable(functions, "enviarCorreoVecinos");

  const enviarCorreo = async () => {
    setResultado(null);

    if (!asunto.trim() || !mensaje.trim()) {
      setResultado({ type: "error", msg: "Debes completar todos los campos." });
      return;
    }

    if (user?.role !== "admin") {
      setResultado({
        type: "error",
        msg: "No tienes permisos para enviar correos.",
      });
      return;
    }

    try {
      setLoading(true);

      const res: any = await enviarCorreoFn({
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
      });

      if (res?.data?.success) {
        setResultado({ type: "success", msg: res.data.message });
        setAsunto("");
        setMensaje("");
      } else {
        setResultado({
          type: "error",
          msg: res?.data?.message || "Error desconocido.",
        });
      }
    } catch (error: any) {
      console.error("Error enviando correo:", error);
      setResultado({
        type: "error",
        msg: error.message || "No se pudo enviar el correo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      {/* HEADER */}
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <AtSign className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl font-bold">
            Enviar correo a vecinos
          </CardTitle>
        </div>

        {/* ❗ corregido className */}
        <p className="text-sm text-muted-foreground">
          Envía un anuncio a todos los vecinos registrados en la plataforma.
        </p>
      </CardHeader>

      {/* FORMULARIO */}
      <CardContent className="space-y-4">
        {/* ASUNTO */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Asunto</label>
          <Input
            placeholder="Ejemplo: Corte de agua este viernes"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
          />
        </div>

        {/* MENSAJE */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Mensaje</label>
          <Textarea
            rows={6}
            placeholder="Escribe aquí el contenido del correo..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </div>

        {/* RESULTADOS */}
        {resultado && (
          <div
            className={`p-3 rounded-md text-sm border ${
              resultado.type === "success"
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}
          >
            {resultado.msg}
          </div>
        )}

        {/* BOTÓN */}
        <Button onClick={enviarCorreo} disabled={loading} className="w-full">
          {loading ? "Enviando..." : "Enviar correo"}
        </Button>
      </CardContent>
    </Card>
  );
}
