import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const SPECIES_EMOJI = { Perro: "🐶", Gato: "🐱", Ave: "🐦", Conejo: "🐰", Otro: "🐾" };

function calcAge(birthDate) {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  if (years >= 1) return years + " año" + (years > 1 ? "s" : "");
  if (months >= 1) return months + " mes" + (months > 1 ? "es" : "");
  return "Recién nacido";
}

function cleanPhone(phone) {
  if (!phone) return null;
  return phone.replace(/[\s\-\(\)]/g, "");
}

export default function EmergencyPage() {
  const { token } = useParams();
  const [pet, setPet] = useState(null);
  const [record, setRecord] = useState(null);
  const [ownerPhone, setOwnerPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      // 1. Obtener datos de la mascota
      const { data: petData, error } = await supabase
        .from("pets")
        .select("id, name, species, breed, birth_date, photo_url, qr_token, owner_id")
        .eq("qr_token", token)
        .single();
        
      if (error || !petData) { 
        setNotFound(true); 
        setLoading(false); 
        return; 
      }
      
      // 2. Obtener el teléfono del dueño 
      // (Esta consulta ahora funcionará en incógnito gracias a las políticas RLS)
      const { data: ownerData } = await supabase
        .from("owners")
        .select("phone")
        .eq("id", petData.owner_id)
        .single();
        
      // 3. Obtener el historial médico
      const { data: recData } = await supabase
        .from("medical_records")
        .select("allergies, surgeries, notes, last_updated_by_owner")
        .eq("pet_id", petData.id)
        .single();
        
      setPet(petData);
      setRecord(recData);
      setOwnerPhone(cleanPhone(ownerData?.phone));
      setLoading(false);
    };
    load();
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-pulse">🚨</div>
        <p className="text-red-600 font-semibold">Cargando datos de emergencia...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Mascota no encontrada</h1>
        <p className="text-gray-500 text-sm">El QR no corresponde a ninguna mascota registrada.</p>
      </div>
    </div>
  );

  const hasAllergies = record?.allergies?.length > 0;
  const hasSurgeries = record?.surgeries?.length > 0;
  const hasNotes = record?.notes?.trim()?.length > 0;
  const waMsg = encodeURIComponent("Hola, acabo de escanear el QR de emergencia de " + pet.name + ".");
  const waUrl = ownerPhone ? "https://api.whatsapp.com/send?phone=" + ownerPhone + "&text=" + waMsg : null;

  const renderContact = () => {
    if (!ownerPhone) return (
      <div className="flex items-center justify-center gap-3 w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl text-base">
        <span className="text-xl">📵</span>
        El dueño no registró teléfono de contacto
      </div>
    );
    
    return (
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📞</span>
          <h3 className="font-bold text-gray-900">Contacto de emergencia</h3>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Número del dueño</p>
            <p className="font-extrabold text-slate-800 text-lg tracking-wide">{ownerPhone}</p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(ownerPhone); toast.success("Número copiado"); }}
            className="text-xs bg-white border border-gray-200 text-gray-500 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Copiar
          </button>
        </div>
        <a
          href={"tel:" + ownerPhone}
          className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-3 rounded-xl transition-all text-sm"
        >
          📞 Llamar ahora
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3 rounded-xl transition-all text-sm"
        >
          💬 Abrir en WhatsApp
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header de Emergencia */}
      <div className="bg-red-600 text-white px-4 py-3 flex items-center gap-3">
        <span className="text-2xl animate-pulse">🚨</span>
        <div>
          <p className="font-extrabold text-sm uppercase tracking-wide">Vista de emergencia</p>
          <p className="text-red-200 text-xs">Información vital · Acceso público</p>
        </div>
        <div className="ml-auto text-2xl">🐾</div>
      </div>

      <div className="px-4 pt-5 pb-8 space-y-4">
        {/* Tarjeta de Foto e Info Básica */}
        <div className="card overflow-hidden">
          <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-50 relative">
            {pet.photo_url ? (
              <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">{SPECIES_EMOJI[pet.species] ?? "🐾"}</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h1 className="text-3xl font-extrabold text-white">{pet.name}</h1>
              <p className="text-white/80 text-sm">
                {pet.species} {pet.breed ? " · " + pet.breed : ""} {pet.birth_date ? " · " + calcAge(pet.birth_date) : ""}
              </p>
            </div>
          </div>
        </div>
        
        {/* Aviso de Confianza Médica */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Datos declarados por el usuario</p>
            <p className="text-xs text-amber-700 mt-0.5">Información ingresada por el dueño. Úsela como referencia de triaje inicial.</p>
          </div>
        </div>

        {/* Sección de Alergias */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🚨</span>
            <h2 className="font-extrabold text-gray-900">Alergias conocidas</h2>
          </div>
          {hasAllergies ? (
            <div className="flex flex-wrap gap-2">
              {record.allergies.map((a, i) => (
                <span key={i} className="bg-red-100 text-red-800 border border-red-300 rounded-full px-4 py-2 text-sm font-bold">⚠️ {a}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No se declararon alergias conocidas.</p>
          )}
        </div>

        {/* Sección de Cirugías */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔪</span>
            <h2 className="font-extrabold text-gray-900">Cirugías previas</h2>
          </div>
          {hasSurgeries ? (
            <div className="space-y-2">
              {record.surgeries.map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="font-bold text-gray-800">{s.name}</p>
                  {s.date && <p className="text-xs text-gray-500 mt-0.5">{new Date(s.date).toLocaleDateString("es-PE")}</p>}
                  {s.notes && <p className="text-sm text-gray-600 mt-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No se declararon cirugías previas.</p>
          )}
        </div>

        {/* Sección de Anotaciones */}
        {hasNotes && (
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📝</span>
              <h2 className="font-extrabold text-gray-900">Anotaciones</h2>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{record.notes}</p>
          </div>
        )}

        {/* Render del Contacto (WhatsApp/Llamada) */}
        {renderContact()}

        {/* Información Protegida */}
        <div className="card p-4 bg-gray-50 border border-dashed border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔒</span>
            <h3 className="font-bold text-gray-600 text-sm">Información protegida</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">El historial completo, datos personales del dueño y documentos adjuntos están protegidos.</p>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-base">🐾</span>
            <span className="font-extrabold text-brand-700">RescueVet</span>
          </div>
          <p className="text-xs text-gray-400">DNI digital para mascotas</p>
          {record?.last_updated_by_owner && (
            <p className="text-xs text-gray-300 mt-1">
              Última actualización: {new Date(record.last_updated_by_owner).toLocaleDateString("es-PE")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}