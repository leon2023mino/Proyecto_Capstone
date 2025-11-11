import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { db, auth } from "../firebase/config";

export type Solicitud = {
  [x: string]: string;
  id?: string;
  tipo: string;
  estado: string;
  createdAt?: any;
  datos?: any;
  revisadoPor?: string | null;
  revisadoEn?: any;
};

export function useSolicitudes(tipo?: string, estado?: string) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Cargar solicitudes
  useEffect(() => {
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

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Solicitud[];
      setSolicitudes(docs);
      setLoading(false);
    });

    return () => unsub();
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

  return { solicitudes, loading, rechazarSolicitud };
}
