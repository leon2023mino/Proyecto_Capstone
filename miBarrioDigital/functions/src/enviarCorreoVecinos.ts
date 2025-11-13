import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Transport Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarCorreoVecinos = onCall(
  { cors: true, enforceAppCheck: false },
  async (request) => {
    try {
      // 1️⃣ Verifica autenticación
      if (!request.auth) {
        throw new Error("No autenticado.");
      }

      const uid = request.auth.uid;

      // 2️⃣ Obtener rol desde Firestore
      const userDoc = await admin.firestore().doc(`users/${uid}`).get();

      if (!userDoc.exists) {
        throw new Error("Usuario no encontrado en Firestore.");
      }

      const userData = userDoc.data();
      const role = userData?.role;

      if (role !== "admin") {
        throw new Error("Solo administradores pueden enviar correos.");
      }

      // 3️⃣ Extraer asunto y mensaje
      const asunto = request.data?.asunto;
      const mensaje = request.data?.mensaje;

      if (!asunto || !mensaje) {
        throw new Error("Faltan campos: asunto y mensaje.");
      }

      // 4️⃣ Obtener correos de vecinos
      const snap = await admin
        .firestore()
        .collection("users")
        .where("role", "==", "vecino")
        .get();

      const correos = snap.docs
        .map((d) => d.data().email)
        .filter(Boolean) as string[];

      if (correos.length === 0) {
        return { success: false, message: "No hay vecinos registrados con email." };
      }

      // 5️⃣ Enviar correo
      await transporter.sendMail({
        from: `Mi Barrio Digital <${process.env.EMAIL_USER}>`,
        bcc: correos,
        subject: asunto,
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>${asunto}</h2>
            <p>${mensaje}</p>
            <hr/>
            <p style="font-size: 12px; color: #888;">Correo enviado desde Mi Barrio Digital</p>
          </div>
        `,
      });

      return { success: true, message: "Correos enviados correctamente." };
    } catch (error: any) {
      console.error("❌ Error enviarCorreoVecinos:", error);
      throw new Error(error.message || "Error interno al enviar correos.");
    }
  }
);
