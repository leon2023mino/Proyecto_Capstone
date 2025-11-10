import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { type Solicitud, type TipoSolicitud } from "../types/Solicitud";

export function useSolicitudes(
  tipo?: TipoSolicitud, // opcional: filtrar por tipo
  estado?: "pendiente" | "aprobada" | "rechazada" // opcional: filtrar por estado
) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const col = collection(db, "requests");
    let q = query(col, orderBy("createdAt", "desc"));

    // Agregar filtros si están definidos
    if (tipo) q = query(col, where("tipo", "==", tipo), orderBy("createdAt", "desc"));
    if (estado) q = query(col, where("estado", "==", estado), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Solicitud[];
        setSolicitudes(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error al obtener solicitudes:", err);
        setError("Error al cargar solicitudes.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [tipo, estado]);

  // 🔹 Aprobar una solicitud
  const aprobarSolicitud = async (id: string, revisadoPor?: string) => {
    try {
      const ref = doc(db, "requests", id);
      await updateDoc(ref, {
        estado: "aprobada",
        revisadoPor: revisadoPor || null,
      });
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
      throw new Error("No se pudo aprobar la solicitud.");
    }
  };

  // 🔹 Rechazar una solicitud
  const rechazarSolicitud = async (id: string, revisadoPor?: string) => {
    try {
      const ref = doc(db, "requests", id);
      await updateDoc(ref, {
        estado: "rechazada",
        revisadoPor: revisadoPor || null,
      });
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      throw new Error("No se pudo rechazar la solicitud.");
    }
  };

  return { solicitudes, loading, error, aprobarSolicitud, rechazarSolicitud };
}
 