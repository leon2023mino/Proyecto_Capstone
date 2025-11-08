import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

type FormState = {
  nombre: string;
  rut: string;
  email: string;
  direccion: string;
  password: string;
  confirm: string;
  acepta: boolean;
  role?: "vecino" | "admin";
};

function normalizarRut(rut: string) {
  return rut.trim().replace(/\./g, "").toUpperCase();
}

export function useRegistroUser() {
  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const validate = (form: FormState): string[] => {
    const errs: string[] = [];
    if (!form.nombre.trim()) errs.push("El nombre es obligatorio.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.push("Correo inválido.");
    if (!form.rut.trim()) errs.push("El RUT es obligatorio.");
    if (form.password.length < 8)
      errs.push("La contraseña debe tener al menos 8 caracteres.");
    if (form.password !== form.confirm)
      errs.push("Las contraseñas no coinciden.");
    if (!form.acepta) errs.push("Debes aceptar los términos y condiciones.");
    return errs;
  };

  /**
   * Registra un nuevo usuario.
   * @param form Los datos del formulario.
   * @param mantenerSesion Si es `false`, se cerrará la sesión luego de registrar.
   */
  const registrarUsuario = async (form: FormState, mantenerSesion = true) => {
    const v = validate(form);
    setErrors(v);
    if (v.length) return false;

    setSending(true);
    try {
      // Crear usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      // Actualizar nombre en Auth
      await updateProfile(cred.user, { displayName: form.nombre.trim() });

      // Guardar documento en Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        displayName: form.nombre.trim(),
        email: form.email.trim(),
        rut: normalizarRut(form.rut),
        address: form.direccion.trim() || null,
        phone: null,
        uv: null,
        role: form.role || "vecino",
        membershipStatus: "pendiente",
        createdAt: serverTimestamp(),
      });

      // Si el registro fue hecho por un admin, no mantener la sesión
      if (!mantenerSesion) {
        await signOut(auth);
      }

      return true;
    } catch (err: any) {
      const map: Record<string, string> = {
        "auth/email-already-in-use": "El correo ya está en uso.",
        "auth/invalid-email": "Correo inválido.",
        "auth/weak-password": "La contraseña es muy débil.",
      };
      setErrors([map[err?.code] ?? "No se pudo crear la cuenta."]);
      console.error(err);
      return false;
    } finally {
      setSending(false);
    }
  };

  return { errors, sending, registrarUsuario, setErrors };
}
