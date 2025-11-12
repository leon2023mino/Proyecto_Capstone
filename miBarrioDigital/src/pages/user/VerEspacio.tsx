import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Dumbbell,
  Trees,
  Building2,
  Volleyball,
  Flame,
  Home,
  Waves,
  CalendarClock,
  Lock,
} from "lucide-react";

export default function VerEspacio() {
  const { id } = useParams();
  const { user } = useAuth();
  const [espacio, setEspacio] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [horaInicio, setHoraInicio] = useState<string>("");
  const [horaFin, setHoraFin] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ocupadas, setOcupadas] = useState<string[]>([]);

  const horas = Array.from({ length: 14 }, (_, i) => `${8 + i}:00`);

  // 🔹 Cargar datos del espacio
  useEffect(() => {
    const fetchEspacio = async () => {
      const ref = doc(db, "spaces", id!);
      const snap = await getDoc(ref);
      if (snap.exists()) setEspacio(snap.data());
    };
    fetchEspacio();
  }, [id]);

  // 🔹 Escuchar reservas del día seleccionado en tiempo real
  useEffect(() => {
    if (!selectedDate || !id) return;

    const q = query(
      collection(db, "reservas"),
      where("espacioId", "==", id),
      where("fecha", "==", selectedDate)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const horasOcupadas: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const start = parseInt(data.horaInicio);
        const end = parseInt(data.horaFin);
        for (let h = start; h < end; h++) {
          horasOcupadas.push(`${h}:00`);
        }
      });
      setOcupadas(horasOcupadas);
    });

    return () => unsub();
  }, [selectedDate, id]);

  // 🔹 Íconos por tipo
  const iconoTipo = (tipo: string) => {
    const t = tipo?.toLowerCase() || "";
    if (t.includes("cancha"))
      return <Volleyball className="w-8 h-8 text-[#57b460]" />;
    if (t.includes("quincho"))
      return <Flame className="w-8 h-8 text-[#57b460]" />;
    if (t.includes("salón"))
      return <Building2 className="w-8 h-8 text-[#57b460]" />;
    if (t.includes("gimn"))
      return <Dumbbell className="w-8 h-8 text-[#57b460]" />;
    if (t.includes("piscina"))
      return <Waves className="w-8 h-8 text-[#57b460]" />;
    if (t.includes("jardín") || t.includes("parque"))
      return <Trees className="w-8 h-8 text-[#57b460]" />;
    return <Home className="w-8 h-8 text-[#57b460]" />;
  };

  // 🔹 Hacer reserva directa
  const reservar = async () => {
    if (!user) return alert("⚠️ Debes iniciar sesión para reservar.");
    if (!selectedDate || !horaInicio || !horaFin)
      return alert("⚠️ Completa la fecha y las horas antes de reservar.");

    const inicio = parseInt(horaInicio);
    const fin = parseInt(horaFin);
    if (inicio >= fin)
      return alert("⚠️ Hora de inicio debe ser anterior al fin.");

    // Validar si alguna hora está ocupada
    for (let h = inicio; h < fin; h++) {
      if (ocupadas.includes(`${h}:00`)) {
        return alert(`❌ La hora ${h}:00 ya está reservada.`);
      }
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "reservas"), {
        espacioId: id,
        usuarioId: user.uid,
        fecha: selectedDate,
        horaInicio,
        horaFin,
        creadoEn: Timestamp.now(),
      });

      alert("✅ Reserva confirmada. ¡Nos vemos ese día!");
      setHoraInicio("");
      setHoraFin("");
    } catch (error) {
      console.error(error);
      alert("❌ Ocurrió un error al reservar.");
    } finally {
      setLoading(false);
    }
  };

  if (!espacio)
    return (
      <p className="text-center mt-10 text-gray-600">Cargando espacio...</p>
    );

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      {/* 🔹 Título */}
      <div className="flex items-center gap-3 mb-6">
        {iconoTipo(espacio.tipo || "")}
        <h1 className="text-3xl font-bold text-gray-800">
          Reservar: {espacio.nombre}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-xl shadow-md max-w-5xl w-full">
        {/* 🖼 Imagen */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={espacio.imagen}
            alt={espacio.nombre}
            className="rounded-lg w-full max-w-md object-cover shadow-md"
          />
          <div className="mt-4 text-gray-700 text-sm w-full px-4 space-y-1">
            <p>
              <strong>Tipo:</strong> {espacio.tipo}
            </p>
            <p>
              <strong>Aforo:</strong> {espacio.aforo}
            </p>
            <p>
              <strong>Ubicación:</strong> {espacio.ubicacion}
            </p>
          </div>
        </div>

        {/* 📅 Formulario */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <CalendarClock className="inline w-5 h-5 mr-2 text-[#57b460]" />
              Selecciona una fecha:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg p-2 w-full"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* ⏰ Selección de horas */}
          <div className="grid grid-cols-2 gap-4 my-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Hora de inicio:
              </label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Seleccionar...</option>
                {horas.map((h) => (
                  <option key={h} value={h} disabled={ocupadas.includes(h)}>
                    {h} {ocupadas.includes(h) && "🔒"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Hora de término:
              </label>
              <select
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="border rounded-lg p-2 w-full"
              >
                <option value="">Seleccionar...</option>
                {horas.map((h) => (
                  <option key={h} value={h} disabled={ocupadas.includes(h)}>
                    {h} {ocupadas.includes(h) && "🔒"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={reservar}
            disabled={loading}
            className="bg-[#57b460] hover:bg-[#4ca258] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition disabled:bg-gray-400"
          >
            {loading ? "Reservando..." : "Confirmar Reserva"}
          </button>
        </div>
      </div>

      {/* Mostrar horas bloqueadas */}
      {ocupadas.length > 0 && (
        <div className="mt-8 text-gray-700 bg-white p-4 rounded-lg shadow max-w-3xl w-full">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-500" /> Horas no disponibles:
          </h3>
          <p className="text-sm">
            {ocupadas.sort((a, b) => parseInt(a) - parseInt(b)).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
