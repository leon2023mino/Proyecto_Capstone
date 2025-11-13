import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export { enviarCorreoVecinos } from "./enviarCorreoVecinos";
export { aprobarSolicitud } from "./aprobarSolicitud";   // 👈 debes agregar esto
