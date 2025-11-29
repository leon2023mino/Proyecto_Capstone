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

// ------------------------------
// Tipos
// ------------------------------
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

type DatosSolicitud = {
  nombre: string;
  rut: string;
  email: string;
  direccion: string;
  role: "vecino" | "admin";
};

export function useRegistroUser() {
  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  // ------------------------------------------------
  // 🟦 Registrar usuario (3 casos)
  // ------------------------------------------------
  const registrarUsuario = async (
    form: RegistroForm,
    mantenerSesion = true
  ) => {
    setErrors([]);
    setSending(true);

    try {
      if (form.role === "vecino" && !mantenerSesion) {
        // 🧠 Admin creando vecino directamente
        await crearCuentaDirecta(form);
      } else if (form.role === "vecino" && mantenerSesion) {
        // 🧩 Vecino → crea solicitud de registro
        await crearSolicitud(form);
      } else if (form.role === "admin") {
        // 👨‍💼 Admin creando otro admin
        await crearCuentaDirecta(form);
      }

      return true;
    } catch (err: any) {
      console.error("❌ Error registrarUsuario:", err);

      // 🔹 Manejo más amigable de errores
      if (err?.code === "auth/email-already-in-use") {
        setErrors([
          "Este correo ya está registrado en el sistema. Si el usuario olvidó su contraseña, puede recuperarla desde el inicio de sesión.",
        ]);
      } else {
        setErrors([
          err?.message || "Error desconocido al registrar usuario.",
        ]);
      }

      return false;
    } finally {
      setSending(false);
    }
  };

  // ------------------------------------------------
  // 🔵 Crear cuenta directamente
  // ------------------------------------------------
  const crearCuentaDirecta = async (form: RegistroForm) => {
    if (!form.password)
      throw new Error("Debe ingresar una contraseña para el usuario.");

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

  // ------------------------------------------------
  // 🟧 Crear solicitud
  // ------------------------------------------------
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

  // ------------------------------------------------
  // 🟩 Aprobar solicitud
  // ------------------------------------------------
  const aprobarSolicitud = async (
    solicitudId: string,
    solicitudCompleta: any,
    adminId?: string
  ) => {
    let secondaryApp: any = null;
    let secondaryAuth: any = null;

    try {
      const tipo = solicitudCompleta?.tipo || "registro";

      // ---------------------------------------------
      // 🟣 1) Aprobar SOLICITUD DE ACTIVIDAD
      // ---------------------------------------------
      if (tipo === "actividad") {
        const refActividad = doc(
          db,
          "actividades",
          solicitudCompleta.actividadId
        );

        await addDoc(collection(refActividad, "inscritos"), {
          usuarioId: solicitudCompleta.usuarioId,
          nombre: solicitudCompleta.datos?.nombre || "",
          email: solicitudCompleta.datos?.email || "",
          fechaInscripcion: new Date(),
        });

        await updateDoc(refActividad, { cupoDisponible: increment(-1) });
        await updateDoc(doc(db, "requests", solicitudId), {
          estado: "aprobada",
          revisadoPor: adminId || null,
          revisadoEn: serverTimestamp(),
        });

        alert("✅ Solicitud de actividad aprobada.");
        return;
      }

      // ---------------------------------------------
      // 🟡 2) Aprobar CERTIFICADO
      // ---------------------------------------------
      if (tipo === "certificado") {
        await updateDoc(doc(db, "requests", solicitudId), {
          estado: "aprobada",
          revisadoPor: adminId || null,
          revisadoEn: serverTimestamp(),
        });

        alert("📄 Certificado aprobado correctamente.");
        return;
      }

      // ---------------------------------------------
      // 🟢 3) Aprobar REGISTRO
      // ---------------------------------------------
      const d: DatosSolicitud = solicitudCompleta?.datos;

      if (!d || !d.email) {
        throw new Error("La solicitud no contiene un email válido.");
      }

      const { email, nombre, rut, direccion, role } = d;

      // Cerrar apps secundarias previas si existen
      const existing = getApps().find((a) => a.name === "SecondaryApp");
      if (existing) await deleteApp(existing);

      // Crear app secundaria
      secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
      secondaryAuth = getAuth(secondaryApp);
      await setPersistence(secondaryAuth, inMemoryPersistence);

      const tempPass = Math.random().toString(36).slice(-8) + "Aa1!";

      try {
        const cred = await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          tempPass
        );

        await setDoc(doc(db, "users", cred.user.uid), {
          displayName: nombre,
          email,
          rut,
          direccion,
          role: role || "vecino",
          membershipStatus: "activo",
          createdAt: serverTimestamp(),
        });

        await sendPasswordResetEmail(secondaryAuth, email);
      } catch (error: any) {
        // 🔹 Caso especial: el correo ya existe en Auth
        if (error?.code === "auth/email-already-in-use") {
          const friendlyError: any = new Error(
            "Este correo ya tiene una cuenta registrada en el sistema."
          );
          friendlyError.code = "auth/email-already-in-use";
          throw friendlyError;
        }

        throw error;
      }

      // Si todo salió bien, marcamos la solicitud como aprobada
      await updateDoc(doc(db, "requests", solicitudId), {
        estado: "aprobada",
        revisadoPor: adminId || null,
        revisadoEn: serverTimestamp(),
      });

      alert(`✅ Usuario ${nombre} creado y correo enviado a ${email}.`);
    } catch (error: any) {
      console.error("❌ Error aprobarSolicitud:", error);
      // Muy importante: RE-lanzar el error para que AdminSolicitudes lo capture
      throw error;
    } finally {
      // Limpieza de la app secundaria
      if (secondaryAuth) {
        try {
          await signOut(secondaryAuth);
        } catch {
          /* ignore */
        }
      }
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch {
          /* ignore */
        }
      }
    }
  };

  // ------------------------------------------------
  // 🔴 Rechazar solicitud
  // ------------------------------------------------
  const rechazarSolicitud = async (solicitudId: string, adminId?: string) => {
    await setDoc(
      doc(db, "requests", solicitudId),
      {
        estado: "rechazada",
        revisadoPor: adminId || null,
        revisadoEn: serverTimestamp(),
      },
      { merge: true }
    );

    alert("❌ Solicitud rechazada.");
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
