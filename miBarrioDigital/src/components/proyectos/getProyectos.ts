import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// 🔹 Tipo base de proyecto
export type Proyecto = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  imagen?: string;
  categoria?: string;
  createdAt?: any;
};

// 🔹 Escuchar proyectos en tiempo real
export function subscribeToProyectos(
  callback: (proyectos: Proyecto[]) => void
) {
  const q = query(collection(db, "proyectos"), orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as DocumentData),
    })) as Proyecto[];
    callback(docs);
  });

  return unsubscribe;
}
