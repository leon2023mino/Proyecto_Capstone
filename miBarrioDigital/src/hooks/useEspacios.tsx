import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";


export type Espacio = {
    id: string;
    nombre: string;
    Ubicacion: string;
    aforo: number;
    tipo: string;
    activo: boolean;
}

export function useEspacios() {

    const [espacios, setEspacios] = useState<Espacio[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const q = query(collection(db, "spaces"), orderBy("nombre", "asc"));

        const unsub = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((doc) =>({
                id: doc.id,
                ...doc.data(),
            })) as Espacio[];
            setEspacios(docs);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { espacios, loading };    

}