import { Calendar, Home, FileText, Inbox } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { stats, actividadesRecientes, solicitudesRecientes, loading } =
    useDashboardData();

  if (loading)
    return (
      <p className="text-center text-muted-foreground mt-10">
        Cargando datos...
      </p>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general del panel de administración
        </p>
      </div>

      {/* ====== TARJETAS RESUMEN ====== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Actividades Activas"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          value={stats.actividades}
          subtitle="Registradas en total"
        />
        <StatCard
          title="Espacios Disponibles"
          icon={<Home className="h-4 w-4 text-muted-foreground" />}
          value={stats.espacios}
          subtitle="Totales en la comunidad"
        />
        <StatCard
          title="Noticias Publicadas"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          value={stats.noticias}
          subtitle="Publicadas en total"
        />
        <StatCard
          title="Solicitudes Pendientes"
          icon={<Inbox className="h-4 w-4 text-muted-foreground" />}
          value={stats.solicitudesPendientes}
          subtitle="A la espera de aprobación"
        />
      </div>

      {/* ====== LISTAS RECIENTES ====== */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>Últimas actividades programadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {actividadesRecientes.length > 0 ? (
              actividadesRecientes.map((act) => (
                <div key={act.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{act.nombre || "Sin título"}</p>
                    <p className="text-sm text-muted-foreground">
                      {act.fechaInicio
                        ? new Date(
                            act.fechaInicio.seconds * 1000
                          ).toLocaleDateString()
                        : "Fecha no definida"}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {act.inscritos
                      ? `${act.inscritos.length} inscritos`
                      : "Sin datos"}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay actividades recientes.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>Últimas solicitudes registradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {solicitudesRecientes.length > 0 ? (
              solicitudesRecientes.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.tipo || "Solicitud"}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.nombre || "Sin nombre"}
                    </p>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      s.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : s.estado === "aprobada"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {s.estado || "Desconocido"}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay solicitudes recientes.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Componente reutilizable para tarjetas */
function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
