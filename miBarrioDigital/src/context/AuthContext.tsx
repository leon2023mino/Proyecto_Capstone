import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

type ExtendedUser = User & {
  role?: "admin" | "vecino";
};

type AuthCtx = {
  user: ExtendedUser | null;
  loading: boolean;
};

const Ctx = createContext<AuthCtx>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 🔹 Buscar el rol del usuario en Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);
          const data = snap.exists() ? snap.data() : {};
          const role = (data?.role as "admin" | "vecino") || "vecino";

          // 🔹 Combinar datos de Firebase Auth + Firestore
          setUser(Object.assign(firebaseUser, { role }) as ExtendedUser);
        } catch (error) {
          console.error("Error cargando rol del usuario:", error);
          setUser(
            Object.assign(firebaseUser, {
              role: "vecino" as const,
            }) as ExtendedUser
          );
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
