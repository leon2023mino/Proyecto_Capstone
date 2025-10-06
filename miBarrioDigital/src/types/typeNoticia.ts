// src/types/Noticias.ts
export interface Noticia {
  id: string;
  titulo: string;
  contenido: string;
  coverUrl?: string;
  galeriaUrls?: string[];
  publicadoPor?: string;
  createdAt?: Date;
  visibleDesde?: Date | null;
  visibleHasta?: Date | null;
}
