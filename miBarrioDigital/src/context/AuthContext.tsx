// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

type ExtendedUser = User & {
  role?: "admin" | "vecino";
};

type AuthCtx = {
  user: ExtendedUser | null;
  role: "admin" | "vecino" | null;
  loading: boolean;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [role, setRole] = useState<"admin" | "vecino" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 🔹 Buscar el rol en Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);
          const data = snap.exists() ? snap.data() : {};
          const foundRole = (data?.role as "admin" | "vecino") || "vecino";

          // 🔹 Guardar en estado
          setUser(
            Object.assign(firebaseUser, { role: foundRole }) as ExtendedUser
          );
          setRole(foundRole);
        } catch (error) {
          console.error("Error cargando rol del usuario:", error);
          setUser(
            Object.assign(firebaseUser, { role: "vecino" }) as ExtendedUser
          );
          setRole("vecino");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <Ctx.Provider value={{ user, role, loading }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
