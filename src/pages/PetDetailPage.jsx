import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Layout from '../components/ui/Layout'
import QRSection from '../components/qr/QRSection'

function calcAge(birthDate) {
  if (!birthDate) return null
  const diff = Date.now() - new Date(birthDate).getTime()
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))
  if (years >= 1) return `${years} año${years > 1 ? 's' : ''}`
  if (months >= 1) return `${months} mes${months > 1 ? 'es' : ''}`
  return 'Recién nacido'
}

const SPECIES_EMOJI = { Perro: '🐶', Gato: '🐱', Ave: '🐦', Conejo: '🐰', Otro: '🐾' }

export default function PetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [{ data: petData }, { data: recData }] = await Promise.all([
        supabase.from('pets').select('*').eq('id', id).single(),
        supabase.from('medical_records').select('*').eq('pet_id', id).single(),
      ])
      if (!petData) { navigate('/dashboard'); return }
      setPet(petData)
      setRecord(recData)
      setLoading(false)
    }
    load()
  }, [id, navigate])

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">🐾</div>
      </div>
    </Layout>
  )

  const hasAllergies = record?.allergies?.length > 0
  const hasSurgeries = record?.surgeries?.length > 0
  const hasVaccines = record?.vaccines?.length > 0
  const hasNotes = record?.notes?.trim()?.length > 0
  const hasMedical = hasAllergies || hasSurgeries || hasVaccines || hasNotes

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">‹</button>
          <h2 className="text-xl font-extrabold text-gray-900 flex-1">{pet.name}</h2>
          <Link to={`/mascotas/${id}/editar`} className="text-sm text-brand-600 font-semibold hover:underline">
            Editar
          </Link>
        </div>

        {/* Tarjeta de identidad — formato ID card */}
        <div className="card">
          <div className="flex gap-4 p-5 items-center">
            {/* Foto cuadrada */}
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-brand-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
              {pet.photo_url
                ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                : <span className="text-5xl">{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-extrabold text-gray-900">{pet.name}</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {pet.species}{pet.breed ? ` · ${pet.breed}` : ''}
              </p>
              {pet.birth_date && (
                <p className="text-xs text-gray-400 mt-1">{calcAge(pet.birth_date)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Historial médico */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-900">Historial médico</h4>
            <Link to={`/mascotas/${id}/historial`} className="text-sm text-brand-600 font-semibold hover:underline">
              {hasMedical ? 'Editar' : 'Agregar'}
            </Link>
          </div>

          {!hasMedical ? (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">Sin datos médicos aún</p>
              <Link to={`/mascotas/${id}/historial`}
                className="mt-3 inline-block text-sm text-brand-600 font-semibold hover:underline">
                + Cargar historial
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Badge datos declarados */}
              <span className="user-declared-badge">⚠️ Datos declarados por el usuario</span>

              {hasAllergies && (
                <div>
                  <p className="section-title">Alergias</p>
                  <div className="flex flex-wrap gap-2">
                    {record.allergies.map((a, i) => (
                      <span key={i} className="bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 text-sm font-medium">
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasSurgeries && (
                <div>
                  <p className="section-title">Cirugías previas</p>
                  <div className="space-y-2">
                    {record.surgeries.map((s, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3 text-sm">
                        <p className="font-semibold text-gray-800">{s.name}</p>
                        {s.date && <p className="text-gray-500 text-xs mt-0.5">{new Date(s.date).toLocaleDateString('es-AR')}</p>}
                        {s.notes && <p className="text-gray-600 mt-1">{s.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasVaccines && (
                <div>
                  <p className="section-title">Vacunas</p>
                  <div className="space-y-2">
                    {record.vaccines.map((v, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">💉 {v.name}</p>
                          {v.date && <p className="text-gray-500 text-xs">{new Date(v.date).toLocaleDateString('es-AR')}</p>}
                        </div>
                        {v.next_due && (
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Próxima</p>
                            <p className="text-xs font-semibold text-brand-600">{new Date(v.next_due).toLocaleDateString('es-AR')}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasNotes && (
                <div>
                  <p className="section-title">Anotaciones</p>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">{record.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* QR */}
        <QRSection pet={pet} />

      </div>
    </Layout>
  )
}