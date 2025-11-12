import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
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
    // 🧩 Suscripciones a cada colección
    const unsubActividades = onSnapshot(collection(db, "actividades"), (snap) => {
      setStats((prev) => ({ ...prev, actividades: snap.size }));
    });

    const unsubEspacios = onSnapshot(collection(db, "spaces"), (snap) => {
      setStats((prev) => ({ ...prev, espacios: snap.size }));
    });

    const unsubNoticias = onSnapshot(collection(db, "posts"), (snap) => {
      setStats((prev) => ({ ...prev, noticias: snap.size }));
    });

    const unsubSolicitudesPendientes = onSnapshot(
      query(collection(db, "solicitudes"), where("estado", "==", "pendiente")),
      (snap) => {
        setStats((prev) => ({ ...prev, solicitudesPendientes: snap.size }));
      }
    );

    // 🔹 Actividades recientes
    const unsubActividadesRecientes = onSnapshot(
      query(collection(db, "actividades"), orderBy("fechaInicio", "desc"), limit(3)),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Actividad[];
        setActividadesRecientes(data);
      }
    );

    // 🔹 Solicitudes recientes
    const unsubSolicitudesRecientes = onSnapshot(
      query(collection(db, "solicitudes"), orderBy("createdAt", "desc"), limit(3)),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Solicitud[];
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
