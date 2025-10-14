import { Timestamp } from "firebase/firestore";


export type NuevaNoticia = {
  titulo: string;
  descripcion: string;
  coverUrl: string;
  createdAt: Timestamp | string;
  galeriaRaw: string; // input de texto, separado por coma
  visibleDesde: string; // yyyy-mm-dd
  visibleHasta: string; // yyyy-mm-dd
  autor: string;
};