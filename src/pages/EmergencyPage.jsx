import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"

const SPECIES_EMOJI = { Perro: "🐶", Gato: "🐱", Ave: "🐦", Conejo: "🐰", Otro: "🐾" }

function calcAge(birthDate) {
  if (!birthDate) return null
  const diff = Date.now() - new Date(birthDate).getTime()
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))
  if (years >= 1) return years + " año" + (years > 1 ? "s" : "")
  if (months >= 1) return months + " mes" + (months > 1 ? "es" : "")
  return "Recién nacido"
}

function cleanPhone(phone) {
  if (!phone) return null
  return phone.replace(/[\s\-\(\)]/g, "")
}

const WhatsAppIcon = () => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "w-6 h-6" },
    React.createElement("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" }),
    React.createElement("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.17 1.535 5.963L.057 23.927a.5.5 0 0 0 .609.61l6.102-1.463A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.897.933-3.637-.235-.374A9.867 9.867 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118c5.468 0 9.882 4.415 9.882 9.882 0 5.468-4.414 9.882-9.882 9.882z" })
  )
)

export default function EmergencyPage() {
  const { token } = useParams()
  const [pet, setPet] = useState(null)
  const [record, setRecord] = useState(null)
  const [ownerPhone, setOwnerPhone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: petData, error } = await supabase
        .from("pets")
        .select("id, name, species, breed, birth_date, photo_url, qr_token, owner_id")
        .eq("qr_token", token)
        .single()
      if (error || !petData) { setNotFound(true); setLoading(false); return }
      const { data: ownerData } = await supabase.from("owners").select("phone").eq("id", petData.owner_id).single()
      const { data: recData } = await supabase.from("medical_records").select("allergies, surgeries, notes, last_updated_by_owner").eq("pet_id", petData.id).single()
      setPet(petData)
      setRecord(recData)
      setOwnerPhone(cleanPhone(ownerData?.phone))
      setLoading(false)
    }
    load()
  }, [token])

  if (loading) return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-pulse">🚨</div>
        <p className="text-red-600 font-semibold">Cargando datos de emergencia...</p>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Mascota no encontrada</h1>
        <p className="text-gray-500 text-sm">El QR no corresponde a ninguna mascota registrada.</p>
      </div>
    </div>
  )

  const hasAllergies = record?.allergies?.length > 0
  const hasSurgeries = record?.surgeries?.length > 0
  const hasNotes = record?.notes?.trim()?.length > 0
  const waMsg = encodeURIComponent("Hola, acabo de escanear el QR de emergencia de " + pet.name + ".")
  const waUrl = ownerPhone ? "https://wa.me/" + ownerPhone + "?text=" + waMsg : null

  const renderContact = () => {
    if (waUrl) return (
      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-base">
        <WhatsAppIcon />
        Contactar al dueño (Emergencia)
      </a>
    )
    if (ownerPhone) return (
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📞</span>
          <h3 className="font-bold text-gray-900">Contacto de emergencia</h3>
        </div>
        <p className="text-sm text-gray-500 mb-3">Llamá directamente a este número:</p>
        <a href={"tel:" + ownerPhone} className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all text-lg">
          📞 {ownerPhone}
        </a>
      </div>
    )
    return (
      <div className="flex items-center justify-center gap-3 w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-2xl text-base">
        <span className="text-xl">📵</span>
        El dueño no registró teléfono de contacto
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <div className="bg-red-600 text-white px-4 py-3 flex items-center gap-3">
        <span className="text-2xl animate-pulse">🚨</span>
        <div>
          <p className="font-extrabold text-sm uppercase tracking-wide">Vista de emergencia</p>
          <p className="text-red-200 text-xs">Información vital · Acceso público</p>
        </div>
        <div className="ml-auto text-2xl">🐾</div>
      </div>
      <div className="px-4 pt-5 pb-8 space-y-4">
        <div className="card overflow-hidden">
          <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-50 relative">
            {pet.photo_url
              ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><span className="text-8xl">{SPECIES_EMOJI[pet.species] ?? "🐾"}</span></div>}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h1 className="text-3xl font-extrabold text-white">{pet.name}</h1>
              <p className="text-white/80 text-sm">{pet.species}{pet.breed ? " · " + pet.breed : ""}{pet.birth_date ? " · " + calcAge(pet.birth_date) : ""}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Datos declarados por el usuario</p>
            <p className="text-xs text-amber-700 mt-0.5">Información ingresada por el dueño. Úsela como referencia de triaje inicial.</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3"><span className="text-xl">🚨</span><h2 className="font-extrabold text-gray-900">Alergias conocidas</h2></div>
          {hasAllergies
            ? <div className="flex flex-wrap gap-2">{record.allergies.map((a, i) => <span key={i} className="bg-red-100 text-red-800 border border-red-300 rounded-full px-4 py-2 text-sm font-bold">⚠️ {a}</span>)}</div>
            : <p className="text-gray-400 text-sm italic">No se declararon alergias conocidas.</p>}
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3"><span className="text-xl">🔪</span><h2 className="font-extrabold text-gray-900">Cirugías previas</h2></div>
          {hasSurgeries
            ? <div className="space-y-2">{record.surgeries.map((s, i) => <div key={i} className="bg-gray-50 rounded-xl p-3"><p className="font-bold text-gray-800">{s.name}</p>{s.date && <p className="text-xs text-gray-500 mt-0.5">{new Date(s.date).toLocaleDateString("es-AR")}</p>}{s.notes && <p className="text-sm text-gray-600 mt-1">{s.notes}</p>}</div>)}</div>
            : <p className="text-gray-400 text-sm italic">No se declararon cirugías previas.</p>}
        </div>
        {hasNotes && (
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3"><span className="text-xl">📝</span><h2 className="font-extrabold text-gray-900">Anotaciones</h2></div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{record.notes}</p>
          </div>
        )}
        {renderContact()}
        <div className="card p-4 bg-gray-50 border border-dashed border-gray-200">
          <div className="flex items-center gap-2 mb-2"><span className="text-lg">🔒</span><h3 className="font-bold text-gray-600 text-sm">Información protegida</h3></div>
          <p className="text-xs text-gray-400 leading-relaxed">El historial completo, datos personales del dueño y documentos adjuntos están protegidos.</p>
        </div>
        <div className="text-center pt-2">
          <div className="flex items-center justify-center gap-2 mb-1"><span className="text-base">🐾</span><span className="font-extrabold text-brand-700">RescueVet</span></div>
          <p className="text-xs text-gray-400">DNI digital para mascotas</p>
          {record?.last_updated_by_owner && <p className="text-xs text-gray-300 mt-1">Última actualización: {new Date(record.last_updated_by_owner).toLocaleDateString("es-AR")}</p>}
        </div>
      </div>
    </div>
  )
}