// types/Noticias.ts
export type Noticia = {
  id: string;
  titulo: string;
  contenido: string;
  coverUrl?: string;
  galeriaUrls: string[];
  publicadoPor?: string;
  createdAt?: Date; // opcional (undefined si no hay)
  visibleDesde?: Date; // idem
  visibleHasta?: Date; // idem
};
