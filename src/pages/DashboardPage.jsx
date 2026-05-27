import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/ui/Layout'

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

export default function DashboardPage() {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [ownerName, setOwnerName] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: owner } = await supabase
        .from('owners')
        .select('full_name')
        .eq('id', user.id)
        .single()
      if (owner?.full_name) setOwnerName(owner.full_name.split(' ')[0])

      const { data } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false })
      setPets(data ?? [])
      setLoading(false)
    }
    load()
  }, [user.id])

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Hola{ownerName ? `, ${ownerName}` : ''} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {pets.length === 0
            ? 'Registrá tu primera mascota'
            : `${pets.length} mascota${pets.length > 1 ? 's' : ''} registrada${pets.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gray-100" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">Aún no hay mascotas</h3>
          <p className="text-gray-400 text-sm mb-6">Registrá a tu compañero para generar su DNI digital</p>
          <Link to="/mascotas/nueva"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors">
            + Agregar mascota
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map(pet => (
            <Link key={pet.id} to={`/mascotas/${pet.id}`}
              className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-50 flex items-center justify-center flex-shrink-0">
                {pet.photo_url
                  ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                  : <span className="text-3xl">{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base truncate">{pet.name}</h3>
                <p className="text-sm text-gray-500">
                  {pet.species}{pet.breed ? ` · ${pet.breed}` : ''}
                </p>
                {pet.birth_date && (
                  <p className="text-xs text-gray-400 mt-0.5">{calcAge(pet.birth_date)}</p>
                )}
              </div>
              <span className="text-gray-300 text-xl">›</span>
            </Link>
          ))}

          <Link to="/mascotas/nueva"
            className="card p-4 flex items-center gap-4 border-dashed border-2 border-brand-200 hover:border-brand-400 transition-colors bg-brand-50/30">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-brand-500">+</span>
            </div>
            <span className="font-semibold text-brand-600">Agregar mascota</span>
          </Link>
        </div>
      )}
    </Layout>
  )
}