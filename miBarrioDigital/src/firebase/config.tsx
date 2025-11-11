// 🔥 Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// ⚙️ Tu configuración de Firebase (usa los valores reales de tu proyecto)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "253759936534",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 🧩 Inicializar la app principal
const app = initializeApp(firebaseConfig);

// 🗄️ Exportar servicios principales
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// 🚀 Exportar también la app principal (por si la necesitas)
export { app };
