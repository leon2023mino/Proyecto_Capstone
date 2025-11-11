import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { initializeApp as initApp, getApps, deleteApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Inicializa el SDK de Admin (solo una vez)
if (!admin.apps.length) {
  admin.initializeApp();
}

// ⚙️ Configuración principal (copiada desde tu firebaseConfig)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const aprobarSolicitud = functions.https.onCall(async (data, context) => {
  try {
    const { solicitudId, datos, adminId } = data.data;

    if (!solicitudId || !datos || !datos.email) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Faltan parámetros requeridos."
      );
    }

    console.log("➡️ Procesando solicitud:", solicitudId, datos.email);

    // 1️⃣ Eliminar cualquier app secundaria previa
    const existingApp = getApps().find((a) => a.name === "SecondaryApp");
    if (existingApp) {
      try {
        await deleteApp(existingApp);
        console.log("🧹 SecondaryApp anterior eliminada.");
      } catch (err) {
        console.warn("No se pudo eliminar instancia previa:", err);
      }
    }

    // 2️⃣ Crear app secundaria (para crear usuario sin cerrar sesión del admin)
    const secondaryApp = initApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);
    const db = getFirestore(secondaryApp);

    // 3️⃣ Generar contraseña temporal segura
    const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";

    console.log("Creando usuario con contraseña temporal:", tempPassword);

    // 4️⃣ Crear el usuario
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      tempPassword
    );

    // 5️⃣ Guardar el documento del usuario en Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      displayName: datos.nombre,
      email: datos.email,
      rut: datos.rut,
      direccion: datos.direccion,
      role: datos.role || "vecino",
      membershipStatus: "activo",
      createdAt: serverTimestamp(),
    });

    // 6️⃣ Enviar correo para establecer su contraseña real
    await sendPasswordResetEmail(secondaryAuth, datos.email);
    console.log(`📧 Correo enviado a ${datos.email}`);

    // 7️⃣ Actualizar solicitud como aprobada
    const adminDb = admin.firestore();
    await adminDb.doc(`requests/${solicitudId}`).set(
      {
        estado: "aprobada",
        revisadoPor: adminId || null,
        revisadoEn: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // 8️⃣ Cerrar sesión secundaria y limpiar app
    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);

    console.log(`✅ Solicitud ${solicitudId} aprobada exitosamente.`);

    return {
      success: true,
      message: `Solicitud aprobada. Se creó la cuenta para ${datos.email} y se envió el correo para establecer contraseña.`,
    };
  } catch (error: any) {
    console.error("❌ Error en aprobarSolicitud:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "Error desconocido al aprobar solicitud."
    );
  }
});
