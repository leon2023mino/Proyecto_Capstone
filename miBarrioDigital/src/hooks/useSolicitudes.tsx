import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export type Solicitud = {
  id?: string;
  tipo: string;
  estado: string;
  createdAt?: any;
  datos?: any;
  revisadoPor?: string | null;
  revisadoEn?: any;
  actividadId?: string;
  tituloActividad?: string;
};

export function useSolicitudes(tipo?: string, estado?: string) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🧩 Cargar solicitudes
  useEffect(() => {
    try {
      let q = query(collection(db, "requests"));

      if (tipo && estado) {
        q = query(
          collection(db, "requests"),
          where("tipo", "==", tipo),
          where("estado", "==", estado)
        );
      } else if (tipo) {
        q = query(collection(db, "requests"), where("tipo", "==", tipo));
      } else if (estado) {
        q = query(collection(db, "requests"), where("estado", "==", estado));
      }

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Solicitud[];
          setSolicitudes(docs);
          setLoading(false);
        },
        (err) => {
          console.error("Error al obtener solicitudes:", err);
          setError("Error al cargar las solicitudes.");
          setLoading(false);
        }
      );

      return () => unsub();
    } catch (err) {
      console.error(err);
      setError("Error al cargar las solicitudes.");
      setLoading(false);
    }
  }, [tipo, estado]);

  // ❌ Rechazar solicitud
  const rechazarSolicitud = async (id: string, adminId?: string) => {
    try {
      const ref = doc(db, "requests", id);
      await updateDoc(ref, {
        estado: "rechazada",
        revisadoPor: adminId || null,
        revisadoEn: serverTimestamp(),
      });
      alert("❌ Solicitud rechazada.");
    } catch (err) {
      console.error(err);
      alert("❌ Error al rechazar la solicitud.");
    }
  };

  return { solicitudes, loading, error, rechazarSolicitud };
}