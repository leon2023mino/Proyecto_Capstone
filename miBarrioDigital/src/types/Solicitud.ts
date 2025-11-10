import { Timestamp } from "firebase/firestore";

export type TipoSolicitud = "registro" | "espacio" | "certificado";

export interface Solicitud {
  id?: string; // Firestore ID
  tipo: TipoSolicitud;
  estado: "pendiente" | "aprobada" | "rechazada";
  uidSolicitante?: string | null;
  createdAt: Timestamp;
  revisadoPor?: string | null;
  datos: Record<string, any>; // estructura flexible
}
