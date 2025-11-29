import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import "../../styles/AdministrarUsuarios.css";

type Usuario = {
  id: string;
  displayName: string;
  rut: string;
  email: string;
  direccion: string;
  role: "vecino" | "admin";
  membershipStatus?: string;
  createdAt?: Timestamp | null;
};

export default function AdministrarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 👉 Formatear fecha a dd/mm/aaaa (o "-" si no existe)
  const formatFecha = (ts?: Timestamp | null) => {
    if (!ts) return "-";
    const d = ts.toDate();
    return d.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    // Ordenamos por displayName (tu campo de nombre)
    const q = query(collection(db, "users"), orderBy("displayName"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Usuario[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data() as any;
          return {
            id: docSnap.id,
            displayName: d.displayName || "",
            rut: d.rut || "",
            email: d.email || "",
            direccion: d.direccion || "",
            role: (d.role as "vecino" | "admin") || "vecino",
            membershipStatus: d.membershipStatus || "activo",
            createdAt: (d.createdAt as Timestamp) ?? null,
          };
        });
        setUsuarios(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Error al cargar los usuarios");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const cambiarRol = async (userId: string, nuevoRol: "vecino" | "admin") => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: nuevoRol,
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el rol");
    }
  };

  const eliminarUsuario = async (userId: string, email: string) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar al usuario ${email}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      // No hace falta actualizar el estado manualmente,
      // onSnapshot se encargará de sacar al usuario de la lista.
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el usuario");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-usuarios">
      <h2>Administrar usuarios</h2>

      <div className="tabla-wrapper">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Fecha registro</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.displayName}</td>
                <td>{u.rut}</td>
                <td>{u.email}</td>
                <td>{u.direccion}</td>
                <td>{u.membershipStatus || "activo"}</td>
                <td>{formatFecha(u.createdAt)}</td>
                <td>{u.role}</td>
                <td>
                  <div className="acciones-usuarios">
                    {u.role === "admin" ? (
                      <button
                        onClick={() => cambiarRol(u.id, "vecino")}
                        className="btn-rol btn-vecino"
                      >
                        Pasar a vecino
                      </button>
                    ) : (
                      <button
                        onClick={() => cambiarRol(u.id, "admin")}
                        className="btn-rol btn-admin"
                      >
                        Hacer admin
                      </button>
                    )}

                    <button
                      onClick={() => eliminarUsuario(u.id, u.email)}
                      className="btn-rol btn-delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={8}>No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
