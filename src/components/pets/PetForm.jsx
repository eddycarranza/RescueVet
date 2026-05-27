import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import Layout from '../ui/Layout'

const SPECIES_OPTIONS = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Roedor', 'Otro']

export default function PetForm({ pet = null }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef()
  const isEditing = !!pet

  const isCustomSpecies = pet && !SPECIES_OPTIONS.slice(0, -1).includes(pet.species)

  const [form, setForm] = useState({
    name: pet?.name ?? '',
    species: isCustomSpecies ? 'Otro' : (pet?.species ?? 'Perro'),
    customSpecies: isCustomSpecies ? pet.species : '',
    breed: pet?.breed ?? '',
    birth_date: pet?.birth_date ?? '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(pet?.photo_url ?? null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('La foto no puede superar 5 MB'); return }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const uploadPhoto = async (petId) => {
    if (!photoFile) return pet?.photo_url ?? null
    const ext = photoFile.name.split('.').pop()
    const path = `${user.id}/${petId}.${ext}`
    const { error } = await supabase.storage.from('pet-photos').upload(path, photoFile, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(path)
    return data.publicUrl
  }

  const getFinalSpecies = () => form.species === 'Otro' ? (form.customSpecies.trim() || 'Otro') : form.species

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('El nombre es requerido')
    if (form.species === 'Otro' && !form.customSpecies.trim()) return toast.error('Indicá qué tipo de mascota es')
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        species: getFinalSpecies(),
        breed: form.breed,
        birth_date: form.birth_date,
      }
      let petId = pet?.id

      if (isEditing) {
        const photo_url = await uploadPhoto(petId)
        const { error } = await supabase.from('pets').update({ ...payload, photo_url }).eq('id', petId)
        if (error) throw error
        toast.success('Mascota actualizada ✓')
      } else {
        const { data, error } = await supabase.from('pets').insert({ ...payload, owner_id: user.id }).select().single()
        if (error) throw error
        petId = data.id
        const photo_url = await uploadPhoto(petId)
        if (photo_url) await supabase.from('pets').update({ photo_url }).eq('id', petId)
        await supabase.from('medical_records').insert({ pet_id: petId, allergies: [], surgeries: [], vaccines: [] })
        toast.success('¡Mascota registrada! 🐾')
      }
      navigate(`/mascotas/${petId}`)
    } catch (err) {
      toast.error(err.message ?? 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar a ${pet.name}? Esta acción no se puede deshacer.`)) return
    setDeleting(true)
    const { error } = await supabase.from('pets').delete().eq('id', pet.id)
    if (error) { toast.error('No se pudo eliminar'); setDeleting(false) }
    else { toast.success('Mascota eliminada'); navigate('/dashboard') }
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">‹</button>
          <h2 className="text-xl font-extrabold text-gray-900">
            {isEditing ? `Editar a ${pet.name}` : 'Nueva mascota'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Foto */}
          <div className="flex flex-col items-center gap-3">
            <button type="button" onClick={() => fileRef.current.click()}
              className="w-32 h-32 rounded-3xl overflow-hidden bg-brand-50 border-2 border-dashed border-brand-200 flex items-center justify-center hover:border-brand-400 transition-colors flex-shrink-0">
              {photoPreview
                ? <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                : <span className="text-4xl">📷</span>}
            </button>
            <button type="button" onClick={() => fileRef.current.click()}
              className="text-sm text-brand-600 font-medium hover:underline">
              {photoPreview ? 'Cambiar foto' : 'Agregar foto'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input type="text" required placeholder="Ej: Max" className="input-field"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          {/* Especie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especie *</label>
            <div className="grid grid-cols-3 gap-2">
              {SPECIES_OPTIONS.map(s => (
                <button key={s} type="button"
                  onClick={() => setForm(f => ({ ...f, species: s }))}
                  className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all
                    ${form.species === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-100 bg-white text-gray-600 hover:border-brand-200'}`}>
                  {s}
                </button>
              ))}
            </div>
            {/* Input para especie personalizada */}
            {form.species === 'Otro' && (
              <div className="mt-3">
                <input type="text" placeholder="¿Qué tipo de mascota? Ej: Rata, Hamster, Iguana..."
                  className="input-field"
                  value={form.customSpecies}
                  onChange={e => setForm(f => ({ ...f, customSpecies: e.target.value }))} />
              </div>
            )}
          </div>

          {/* Raza */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
            <input type="text" placeholder="Ej: Labrador, Siamés..." className="input-field"
              value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" className="input-field"
              max={new Date().toISOString().split('T')[0]}
              value={form.birth_date} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar mascota'}
          </button>

          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="btn-danger w-full mt-1">
              {deleting ? 'Eliminando...' : '🗑 Eliminar mascota'}
            </button>
          )}
        </form>
      </div>
    </Layout>
  )
}