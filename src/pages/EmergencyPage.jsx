import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SPECIES_EMOJI = { Perro: '🐶', Gato: '🐱', Ave: '🐦', Conejo: '🐰', Otro: '🐾' }

function calcAge(birthDate) {
  if (!birthDate) return null
  const diff = Date.now() - new Date(birthDate).getTime()
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))
  if (years >= 1) return `${years} año${years > 1 ? 's' : ''}`
  if (months >= 1) return `${months} mes${months > 1 ? 'es' : ''}`
  return 'Recién nacido'
}

export default function EmergencyPage() {
  const { token } = useParams()
  const [pet, setPet] = useState(null)
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      // Solo seleccionamos columnas seguras para la vista pública
      const { data: petData, error } = await supabase
        .from('pets')
        .select('id, name, species, breed, birth_date, photo_url, qr_token')
        .eq('qr_token', token)
        .single()

      if (error || !petData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      // Solo alergias y cirugías en la vista pública (no vacunas ni otros datos)
      const { data: recData } = await supabase
        .from('medical_records')
        .select('allergies, surgeries, last_updated_by_owner')
        .eq('pet_id', petData.id)
        .single()

      setPet(petData)
      setRecord(recData)
      setLoading(false)
    }
    load()
  }, [token])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-emergency-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-pulse">🚨</div>
        <p className="text-red-600 font-semibold">Cargando datos de emergencia...</p>
      </div>
    </div>
  )

  // ── Not found ────────────────────────────────────────────────────────────
  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Mascota no encontrada</h1>
        <p className="text-gray-500 text-sm">El código QR escaneado no corresponde a ninguna mascota registrada.</p>
      </div>
    </div>
  )

  const hasAllergies = record?.allergies?.length > 0
  const hasSurgeries = record?.surgeries?.length > 0

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Banner de emergencia */}
      <div className="bg-emergency-600 text-white px-4 py-3 flex items-center gap-3">
        <span className="text-2xl animate-pulse">🚨</span>
        <div>
          <p className="font-extrabold text-sm uppercase tracking-wide">Vista de emergencia</p>
          <p className="text-emergency-100 text-xs">Información vital · Acceso público</p>
        </div>
        <div className="ml-auto">
          <span className="text-2xl">🐾</span>
        </div>
      </div>

      <div className="px-4 pt-5 pb-8 space-y-4">

        {/* Tarjeta de identidad */}
        <div className="card overflow-hidden">
          <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-50 relative">
            {pet.photo_url ? (
              <img src={pet.photo_url} alt={pet.name}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>
              </div>
            )}
            {/* Overlay con nombre */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h1 className="text-3xl font-extrabold text-white">{pet.name}</h1>
              <p className="text-white/80 text-sm">
                {pet.species}{pet.breed ? ` · ${pet.breed}` : ''}
                {pet.birth_date ? ` · ${calcAge(pet.birth_date)}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Badge de datos declarados */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              Datos declarados por el usuario
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Esta información fue ingresada por el dueño de la mascota y no ha sido validada por un profesional veterinario. Úsela como referencia de triaje inicial.
            </p>
          </div>
        </div>

        {/* ── ALERGIAS VITALES ─────────────────────────────────────────── */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🚨</span>
            <h2 className="font-extrabold text-gray-900">Alergias conocidas</h2>
          </div>

          {hasAllergies ? (
            <div className="flex flex-wrap gap-2">
              {record.allergies.map((a, i) => (
                <span key={i}
                  className="bg-red-100 text-red-800 border border-red-300 rounded-full px-4 py-2 text-sm font-bold">
                  ⚠️ {a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No se declararon alergias conocidas.</p>
          )}
        </div>

        {/* ── CIRUGÍAS PREVIAS ──────────────────────────────────────────── */}
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
                  {s.date && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(s.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                  {s.notes && <p className="text-sm text-gray-600 mt-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No se declararon cirugías previas.</p>
          )}
        </div>

        {/* ── INFORMACIÓN PROTEGIDA ─────────────────────────────────────── */}
        <div className="card p-4 bg-gray-50 border border-dashed border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔒</span>
            <h3 className="font-bold text-gray-600 text-sm">Información protegida</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            El historial completo de vacunas, datos personales del dueño y documentos adjuntos están protegidos y no son accesibles en esta vista pública.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-base">🐾</span>
            <span className="font-extrabold text-brand-700">RescueVet</span>
          </div>
          <p className="text-xs text-gray-400">
            DNI digital para mascotas
          </p>
          {record?.last_updated_by_owner && (
            <p className="text-xs text-gray-300 mt-1">
              Última actualización: {new Date(record.last_updated_by_owner).toLocaleDateString('es-AR')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
