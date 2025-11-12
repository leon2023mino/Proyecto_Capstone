import { AdminLayout } from "@/components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Calendar, Home, FileText, Inbox } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general del panel de administración
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actividades Activas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Espacios Disponibles
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">De 10 totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Noticias Publicadas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solicitudes Pendientes
            </CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>Últimas actividades programadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Yoga Matutino</p>
                <p className="text-sm text-muted-foreground">
                  15/02/2024 - 08:00
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                15/20 inscritos
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Taller de Cocina</p>
                <p className="text-sm text-muted-foreground">
                  18/02/2024 - 15:00
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                12/12 inscritos
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cine Familiar</p>
                <p className="text-sm text-muted-foreground">
                  20/02/2024 - 19:00
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                32/50 inscritos
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>Últimas solicitudes de residentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reserva Salón</p>
                <p className="text-sm text-muted-foreground">Juan Pérez</p>
              </div>
              <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Pendiente
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Permiso Mudanza</p>
                <p className="text-sm text-muted-foreground">María González</p>
              </div>
              <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Pendiente
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Acceso Visitas</p>
                <p className="text-sm text-muted-foreground">Carlos Ruiz</p>
              </div>
              <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                Pendiente
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
