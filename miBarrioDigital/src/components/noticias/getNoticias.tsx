// lib/noticias.ts
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  type DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import type { Noticia } from "../../types/typeNoticia";

export function subscribeToNoticias(callback: (items: Noticia[]) => void) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const items: Noticia[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        titulo: String(data.titulo ?? ""),
        contenido: String(data.Contenido ?? data.contenido ?? ""),
        coverUrl: data.coverUrl ? String(data.coverUrl) : undefined,
        galeriaUrls: Array.isArray(data.galeriaUrls)
          ? data.galeriaUrls.map((u: any) => String(u))
          : [],
        publicadoPor: data.publicadoPor ? String(data.publicadoPor) : undefined,
        createdAt: toDateUndef(data.createdAt),
        visibleDesde: toDateUndef(data.visibleDesde),
        visibleHasta: toDateUndef(data.visibleHasta),
      };
    });
    callback(items);
  });
}

const toDateUndef = (v: any): Date | undefined =>
  v instanceof Timestamp ? v.toDate() : v ? new Date(v) : undefined;

export type PageResult = {
  items: Noticia[];
  nextCursor?: QueryDocumentSnapshot<DocumentData>;
};

export async function fetchNoticiasPage(opts?: {
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
  soloVisibles?: boolean;
}): Promise<PageResult> {
  const pageSize = opts?.pageSize ?? 10;

  let q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );
  if (opts?.cursor) {
    q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(opts.cursor),
      limit(pageSize)
    );
  }

  const snap = await getDocs(q);

  let items: Noticia[] = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      titulo: String(data.titulo ?? ""),
      contenido: String(data.Contenido ?? data.contenido ?? ""),
      coverUrl: data.coverUrl ? String(data.coverUrl) : undefined,
      galeriaUrls: Array.isArray(data.galeriaUrls)
        ? data.galeriaUrls.map((u: any) => String(u))
        : [],
      publicadoPor: data.publicadoPor ? String(data.publicadoPor) : undefined,
      createdAt: toDateUndef(data.createdAt),
      visibleDesde: toDateUndef(data.visibleDesde),
      visibleHasta: toDateUndef(data.visibleHasta),
    };
  });

  if (opts?.soloVisibles) {
    const now = new Date();
    items = items.filter((n) => {
      const desdeOk = !n.visibleDesde || n.visibleDesde <= now;
      const hastaOk = !n.visibleHasta || n.visibleHasta >= now;
      return desdeOk && hastaOk;
    });
  }

  return {
    items,
    nextCursor:
      snap.docs.length === pageSize
        ? snap.docs[snap.docs.length - 1]
        : undefined,
  };
}
