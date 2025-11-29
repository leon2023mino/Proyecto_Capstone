import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/config";

type DashboardStats = {
  actividades: number;
  espacios: number;
  noticias: number;
  solicitudesPendientes: number;
};

type Actividad = {
  id: string;
  nombre?: string;
  fechaInicio?: any;
  inscritos?: any[];
};

type Solicitud = {
  id: string;
  tipo?: string;
  nombre?: string;
  estado?: string;
};

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    actividades: 0,
    espacios: 0,
    noticias: 0,
    solicitudesPendientes: 0,
  });
  const [actividadesRecientes, setActividadesRecientes] = useState<Actividad[]>([]);
  const [solicitudesRecientes, setSolicitudesRecientes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🟦 Actividades (total)
    const unsubActividades = onSnapshot(collection(db, "actividades"), (snap) => {
      setStats((prev) => ({ ...prev, actividades: snap.size }));
    });

    // 🟦 Espacios (total)
    const unsubEspacios = onSnapshot(collection(db, "spaces"), (snap) => {
      setStats((prev) => ({ ...prev, espacios: snap.size }));
    });

    // 🟦 Noticias (total)
    const unsubNoticias = onSnapshot(collection(db, "posts"), (snap) => {
      setStats((prev) => ({ ...prev, noticias: snap.size }));
    });

    // 🟦 Solicitudes PENDIENTES (desde `requests`)
    const unsubSolicitudesPendientes = onSnapshot(
      query(
        collection(db, "requests"),
        where("estado", "==", "pendiente")
      ),
      (snap) => {
        setStats((prev) => ({
          ...prev,
          solicitudesPendientes: snap.size,
        }));
      }
    );

    // 🔹 Actividades recientes
    const unsubActividadesRecientes = onSnapshot(
      query(
        collection(db, "actividades"),
        orderBy("fechaInicio", "desc"),
        limit(3)
      ),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Actividad[];
        setActividadesRecientes(data);
      }
    );

    // 🔹 Solicitudes recientes (desde `requests`)
    const unsubSolicitudesRecientes = onSnapshot(
      query(
        collection(db, "requests"),
        orderBy("createdAt", "desc"),
        limit(3)
      ),
      (snap) => {
        const data = snap.docs.map((doc) => {
          const raw = doc.data() as any;
          return {
            id: doc.id,
            tipo: raw.tipo,
            // intenta usar nombre plano, y si no, saca el nombre desde datos.nombre
            nombre: raw.nombre || raw.datos?.nombre || "",
            estado: raw.estado,
          } as Solicitud;
        });

        setSolicitudesRecientes(data);
      }
    );

    setLoading(false);

    // 🧹 Limpiar suscripciones
    return () => {
      unsubActividades();
      unsubEspacios();
      unsubNoticias();
      unsubSolicitudesPendientes();
      unsubActividadesRecientes();
      unsubSolicitudesRecientes();
    };
  }, []);

  return { stats, actividadesRecientes, solicitudesRecientes, loading };
}
