import { useState } from "react";
import {
  sendEmailVerification,
  getAuth,
  setPersistence,
  inMemoryPersistence,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, app, firebaseConfig } from "../firebase/config";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApps, initializeApp, deleteApp } from "firebase/app";

type RegistroForm = {
  nombre: string;
  rut: string;
  email: string;
  direccion: string;
  password: string;
  confirm: string;
  acepta: boolean;
  role: "vecino" | "admin";
};

export function useRegistroUser() {
  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  /**
   * ✅ Registrar usuario (admin o solicitud)
   * @param form Datos del formulario
   * @param mantenerSesion Si el usuario debe quedar logueado tras registro (solo vecinos directos)
   */
  const registrarUsuario = async (
    form: RegistroForm,
    mantenerSesion = true
  ) => {
    setErrors([]);
    setSending(true);

    try {
      if (form.role === "vecino" && !mantenerSesion) {
        // 🧠 Caso admin creando un vecino directo (NO solicitud)
        if (!form.password)
          throw new Error("Falta la contraseña del nuevo usuario.");
        await crearCuentaDirecta(form);
      } else if (form.role === "vecino" && mantenerSesion) {
        // 🧩 Caso vecino común → solo crea solicitud
        await crearSolicitud(form);
      } else if (form.role === "admin") {
        // 👨‍💼 Caso admin creando otro admin
        if (!form.password)
          throw new Error("Falta la contraseña del nuevo administrador.");
        await crearCuentaDirecta(form);
      }
      return true;
    } catch (err: any) {
      console.error("❌ Error registrarUsuario:", err);
      setErrors([err.message || "Error desconocido al registrar usuario."]);
      return false;
    } finally {
      setSending(false);
    }
  };

  /**
   * 🧩 Crear cuenta directamente en Firebase Auth + Firestore
   */
  const crearCuentaDirecta = async (form: RegistroForm) => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    await setDoc(doc(db, "users", cred.user.uid), {
      displayName: form.nombre.trim(),
      email: form.email.trim(),
      rut: form.rut.trim(),
      direccion: form.direccion.trim(),
      role: form.role,
      membershipStatus: "activo",
      createdAt: serverTimestamp(),
    });

    await sendEmailVerification(cred.user);
  };

  /**
   * 📄 Crear solicitud pendiente (vecino)
   */
  const crearSolicitud = async (form: RegistroForm) => {
    await addDoc(collection(db, "requests"), {
      tipo: "registro",
      estado: "pendiente",
      createdAt: serverTimestamp(),
      datos: {
        nombre: form.nombre.trim(),
        rut: form.rut.trim(),
        email: form.email.trim(),
        direccion: form.direccion.trim(),
        role: "vecino",
      },
    });
  };

  /**
   * 👨‍💼 Aprobar solicitud sin cerrar sesión actual
   */

  const functions = getFunctions(app);

  const aprobarSolicitud = async (
    solicitudId: string,
    datos: any,
    adminId?: string
  ) => {
    let secondaryApp: any = null;

    try {
      // 🧹 1️⃣ Eliminar app previa si quedó activa
      const existing = getApps().find((a) => a.name === "SecondaryApp");
      if (existing) await deleteApp(existing);

      // ⚙️ 2️⃣ Crear app secundaria
      secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);

      // 🚫 3️⃣ Forzar persistencia solo en memoria (NO en localStorage)
      await setPersistence(secondaryAuth, inMemoryPersistence);

      // 🔑 4️⃣ Generar contraseña temporal
      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";

      console.log("Creando usuario aislado:", datos.email);

      // 🧠 5️⃣ Crear usuario SIN afectar la sesión actual del admin
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        datos.email,
        tempPassword
      );

      // 🗄️ 6️⃣ Guardar en Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        displayName: datos.nombre,
        email: datos.email,
        rut: datos.rut,
        direccion: datos.direccion,
        role: datos.role,
        membershipStatus: "activo",
        createdAt: serverTimestamp(),
      });

      // 📧 7️⃣ Enviar correo para que cree su contraseña real
      await sendPasswordResetEmail(secondaryAuth, datos.email);

      // 🧾 8️⃣ Actualizar solicitud
      await setDoc(
        doc(db, "requests", solicitudId),
        {
          estado: "aprobada",
          revisadoPor: adminId || null,
          revisadoEn: serverTimestamp(),
        },
        { merge: true }
      );

      // 🚪 9️⃣ Cerrar sesión del auth secundario y eliminar app
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);

      // ✅ Confirmar que el admin sigue logueado
      const mainAuth = getAuth();
      console.log("🔒 Admin sigue activo:", mainAuth.currentUser?.email);

      alert(
        `✅ Solicitud aprobada.\nSe creó la cuenta de ${datos.nombre} y se envió un correo a ${datos.email} para establecer su contraseña.`
      );
    } catch (error: any) {
      console.error("❌ Error al aprobar solicitud:", error);
      alert(
        `Error al aprobar la solicitud:\n${
          error.code || error.message || "Error desconocido."
        }`
      );
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch {}
      }
    }
  };

  /**
   * ❌ Rechazar solicitud
   */
  const rechazarSolicitud = async (solicitudId: string, adminId?: string) => {
    try {
      await setDoc(
        doc(db, "requests", solicitudId),
        {
          estado: "rechazada",
          revisadoPor: adminId || null,
          revisadoEn: serverTimestamp(),
        },
        { merge: true }
      );
      alert("❌ Solicitud rechazada correctamente.");
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      alert("No se pudo rechazar la solicitud.");
    }
  };

  return {
    errors,
    setErrors,
    sending,
    registrarUsuario,
    aprobarSolicitud,
    rechazarSolicitud,
  };
}
