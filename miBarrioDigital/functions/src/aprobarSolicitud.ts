// functions/src/aprobarSolicitud.ts

import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Inicializar Admin solo una vez
if (!admin.apps.length) {
  admin.initializeApp();
}

export const aprobarSolicitud = onCall(
  { cors: true, enforceAppCheck: false },
  async (request) => {
    try {
      // ==================================
      // 🔐 Validar autenticación del admin
      // ==================================
      if (!request.auth) {
        throw new Error("No autenticado.");
      }

      const role = request.auth.token.role;
      if (role !== "admin") {
        throw new Error("No autorizado.");
      }

      // ===============================
      // 📥 Extraer los datos enviados
      // ===============================
      const solicitudId = request.data?.solicitudId;
      const datos = request.data?.datos;

      if (!solicitudId || !datos?.email) {
        throw new Error("Datos incompletos para aprobar la solicitud.");
      }

      // ===============================
      // 🧑‍💻 Crear usuario en Firebase Auth
      // ===============================
      const tempPassword =
        Math.random().toString(36).slice(-8) + "Aa1!";

      const userRecord = await admin.auth().createUser({
        email: datos.email,
        displayName: datos.nombre,
        password: tempPassword,
      });

      // ===============================
      // 🗄 Guardar en Firestore
      // ===============================
      await admin.firestore().doc(`users/${userRecord.uid}`).set({
        nombre: datos.nombre,
        email: datos.email,
        rut: datos.rut,
        direccion: datos.direccion,
        role: datos.role || "vecino",
        membershipStatus: "activo",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // ===============================
      // ✉ Enviar correo de restablecer contraseña
      // (Admin SDK envía email de cambio de password)
      // ===============================
      const resetLink = await admin
        .auth()
        .generatePasswordResetLink(datos.email);

      // * Aquí podrías mandar email manual con nodemailer si quieres
      console.log("🔗 Enlace para restablecer contraseña:", resetLink);

      // ===============================
      // 📝 Marcar solicitud como aprobada
      // ===============================
      await admin
        .firestore()
        .doc(`requests/${solicitudId}`)
        .update({
          estado: "aprobada",
          revisadoPor: request.auth.uid,
          revisadoEn: admin.firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        message: `Usuario creado y solicitud aprobada. Enlace enviado a ${datos.email}`,
      };
    } catch (error: any) {
      console.error("❌ Error aprobarSolicitud:", error);
      throw new Error(error.message || "Error al aprobar solicitud.");
    }
  }
);
