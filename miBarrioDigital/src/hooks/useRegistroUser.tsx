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
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { auth, db, firebaseConfig } from "../firebase/config";
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
        // 🧩 Caso vecino común → crea solicitud de registro
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
   * 📄 Crear solicitud pendiente (registro)
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
   * 👨‍💼 Aprobar solicitud (registro | actividad | certificado)
   */
  const aprobarSolicitud = async (
    solicitudId: string,
    datos: any,
    adminId?: string
  ) => {
    let secondaryApp: any = null;

    try {
      const tipo = datos?.tipo || "registro";

      // 🔹 Aprobación de ACTIVIDAD
      if (tipo === "actividad" && datos?.actividadId) {
        const refActividad = doc(db, "actividades", datos.actividadId);

        // 1️⃣ Registrar inscripción del usuario
        await addDoc(collection(refActividad, "inscritos"), {
          usuarioId: datos.usuarioId,
          nombre: datos.datos?.nombre || "Usuario sin nombre",
          email: datos.datos?.email || "",
          fechaInscripcion: new Date(),
        });

        // 2️⃣ Restar cupo disponible
        await updateDoc(refActividad, {
          cupoDisponible: increment(-1),
        });

        // 3️⃣ Marcar solicitud como aprobada
        await updateDoc(doc(db, "requests", solicitudId), {
          estado: "aprobada",
          revisadoPor: adminId || null,
          revisadoEn: serverTimestamp(),
        });

        alert("✅ Solicitud de actividad aprobada e inscrita correctamente.");
        return;
      }

      // 🔹 Aprobación de CERTIFICADO
      if (tipo === "certificado") {
        await updateDoc(doc(db, "requests", solicitudId), {
          estado: "aprobada",
          revisadoPor: adminId || null,
          revisadoEn: serverTimestamp(),
        });

        alert("📄 Certificado aprobado. El vecino podrá descargarlo ahora.");
        return;
      }

      // 🔹 Aprobación de REGISTRO (flujo normal)
      const existing = getApps().find((a) => a.name === "SecondaryApp");
      if (existing) await deleteApp(existing);

      secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
      const secondaryAuth = getAuth(secondaryApp);
      await setPersistence(secondaryAuth, inMemoryPersistence);

      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";

      console.log("Creando usuario aislado:", datos.email);

      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        datos.email,
        tempPassword
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        displayName: datos.nombre,
        email: datos.email,
        rut: datos.rut,
        direccion: datos.direccion,
        role: datos.role,
        membershipStatus: "activo",
        createdAt: serverTimestamp(),
      });

      await sendPasswordResetEmail(secondaryAuth, datos.email);

      await setDoc(
        doc(db, "requests", solicitudId),
        {
          estado: "aprobada",
          revisadoPor: adminId || null,
          revisadoEn: serverTimestamp(),
        },
        { merge: true }
      );

      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);

      const mainAuth = getAuth();
      console.log("🔒 Admin sigue activo:", mainAuth.currentUser?.email);

      alert(
        `✅ Solicitud de registro aprobada.\nSe creó la cuenta de ${datos.nombre} y se envió un correo a ${datos.email} para establecer su contraseña.`
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
