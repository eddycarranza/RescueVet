import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import Layout from '../ui/Layout'

function AllergiesEditor({ values, onChange }) {
  const [input, setInput] = useState('')
  const add = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    if (values.includes(trimmed)) { toast.error('Ya existe esa alergia'); return }
    onChange([...values, trimmed])
    setInput('')
  }
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" placeholder="Ej: Penicilina, Polen..." className="input-field flex-1"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
        <button type="button" onClick={add}
          className="bg-brand-600 text-white px-4 rounded-xl font-bold hover:bg-brand-700 transition-colors">+</button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((a, i) => (
            <span key={i} className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 rounded-full pl-3 pr-2 py-1 text-sm font-medium">
              ⚠️ {a}
              <button type="button" onClick={() => remove(i)} className="ml-1 text-red-400 hover:text-red-600 leading-none text-base">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SurgeriesEditor({ values, onChange }) {
  const [form, setForm] = useState({ name: '', date: '', notes: '' })
  const [adding, setAdding] = useState(false)
  const add = () => {
    if (!form.name.trim()) { toast.error('Nombre de cirugía requerido'); return }
    onChange([...values, { ...form, name: form.name.trim() }])
    setForm({ name: '', date: '', notes: '' })
    setAdding(false)
  }
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-3">
      {values.map((s, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-3 flex justify-between items-start gap-2">
          <div className="text-sm flex-1">
            <p className="font-semibold text-gray-800">🔪 {s.name}</p>
            {s.date && <p className="text-gray-400 text-xs mt-0.5">{new Date(s.date).toLocaleDateString('es-AR')}</p>}
            {s.notes && <p className="text-gray-600 mt-1">{s.notes}</p>}
          </div>
          <button type="button" onClick={() => remove(i)} className="text-red-300 hover:text-red-500 text-lg leading-none">×</button>
        </div>
      ))}
      {adding ? (
        <div className="bg-brand-50 rounded-xl p-4 space-y-3 border border-brand-100">
          <input type="text" placeholder="Nombre de la cirugía *" className="input-field"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input type="date" className="input-field" max={new Date().toISOString().split('T')[0]}
            value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <textarea placeholder="Notas (opcional)" rows={2} className="input-field resize-none"
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button type="button" onClick={add} className="flex-1 btn-primary py-2">Agregar</button>
            <button type="button" onClick={() => setAdding(false)} className="flex-1 btn-secondary py-2">Cancelar</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-brand-300 hover:text-brand-600 transition-colors">
          + Agregar cirugía
        </button>
      )}
    </div>
  )
}

function VaccinesEditor({ values, onChange }) {
  const [form, setForm] = useState({ name: '', date: '', next_due: '' })
  const [adding, setAdding] = useState(false)
  const add = () => {
    if (!form.name.trim()) { toast.error('Nombre de vacuna requerido'); return }
    if (!form.date) { toast.error('Fecha de aplicación requerida'); return }
    onChange([...values, { ...form, name: form.name.trim() }])
    setForm({ name: '', date: '', next_due: '' })
    setAdding(false)
  }
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-3">
      {values.map((v, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-3 flex justify-between items-start gap-2">
          <div className="text-sm flex-1">
            <p className="font-semibold text-gray-800">💉 {v.name}</p>
            {v.date && <p className="text-gray-400 text-xs mt-0.5">Aplicada: {new Date(v.date).toLocaleDateString('es-AR')}</p>}
            {v.next_due && <p className="text-brand-600 text-xs font-medium">Próxima: {new Date(v.next_due).toLocaleDateString('es-AR')}</p>}
          </div>
          <button type="button" onClick={() => remove(i)} className="text-red-300 hover:text-red-500 text-lg leading-none">×</button>
        </div>
      ))}
      {adding ? (
        <div className="bg-brand-50 rounded-xl p-4 space-y-3 border border-brand-100">
          <input type="text" placeholder="Nombre de la vacuna *" className="input-field"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Fecha de aplicación *</label>
            <input type="date" className="input-field" max={new Date().toISOString().split('T')[0]}
              value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Próxima dosis (opcional)</label>
            <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]}
              value={form.next_due} onChange={e => setForm(f => ({ ...f, next_due: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={add} className="flex-1 btn-primary py-2">Agregar</button>
            <button type="button" onClick={() => setAdding(false)} className="flex-1 btn-secondary py-2">Cancelar</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-brand-300 hover:text-brand-600 transition-colors">
          + Agregar vacuna
        </button>
      )}
    </div>
  )
}

export default function MedicalForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState({ allergies: [], surgeries: [], vaccines: [], notes: '' })
  const [petName, setPetName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [{ data: pet }, { data: rec }] = await Promise.all([
        supabase.from('pets').select('name').eq('id', id).single(),
        supabase.from('medical_records').select('*').eq('pet_id', id).single(),
      ])
      if (pet) setPetName(pet.name)
      if (rec) setRecord({
        allergies: rec.allergies ?? [],
        surgeries: rec.surgeries ?? [],
        vaccines: rec.vaccines ?? [],
        notes: rec.notes ?? '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('medical_records').upsert({
      pet_id: id,
      allergies: record.allergies,
      surgeries: record.surgeries,
      vaccines: record.vaccines,
      notes: record.notes,
      last_updated_by_owner: new Date().toISOString(),
    }, { onConflict: 'pet_id' })
    setSaving(false)
    if (error) toast.error('Error al guardar: ' + error.message)
    else { toast.success('Historial guardado ✓'); navigate(`/mascotas/${id}`) }
  }

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="text-4xl animate-bounce">🐾</div>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">‹</button>
          <h2 className="text-xl font-extrabold text-gray-900">Historial de {petName}</h2>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex gap-2 items-start">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800">Datos declarados por el usuario</p>
            <p className="text-xs text-amber-700 mt-0.5">Esta información es ingresada por el dueño y no ha sido validada por un profesional veterinario.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="card p-4">
            <h3 className="font-bold text-gray-900 mb-1">🚨 Alergias vitales</h3>
            <p className="text-xs text-gray-400 mb-3">Alergias conocidas a medicamentos, alimentos u otros.</p>
            <AllergiesEditor values={record.allergies} onChange={v => setRecord(r => ({ ...r, allergies: v }))} />
          </div>

          <div className="card p-4">
            <h3 className="font-bold text-gray-900 mb-1">🔪 Cirugías previas</h3>
            <p className="text-xs text-gray-400 mb-3">Intervenciones quirúrgicas anteriores.</p>
            <SurgeriesEditor values={record.surgeries} onChange={v => setRecord(r => ({ ...r, surgeries: v }))} />
          </div>

          <div className="card p-4">
            <h3 className="font-bold text-gray-900 mb-1">💉 Vacunas</h3>
            <p className="text-xs text-gray-400 mb-3">Registro de vacunas aplicadas y próximas fechas.</p>
            <VaccinesEditor values={record.vaccines} onChange={v => setRecord(r => ({ ...r, vaccines: v }))} />
          </div>

          {/* NUEVO: Anotaciones generales */}
          <div className="card p-4">
            <h3 className="font-bold text-gray-900 mb-1">📝 Anotaciones generales</h3>
            <p className="text-xs text-gray-400 mb-3">Cualquier información adicional relevante para el veterinario.</p>
            <textarea
              rows={4}
              placeholder="Ej: Tiene miedo a los ruidos fuertes, come dieta especial sin gluten, toma medicación diaria para la tiroides..."
              className="input-field resize-none"
              value={record.notes}
              onChange={e => setRecord(r => ({ ...r, notes: e.target.value }))}
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : 'Guardar historial'}
          </button>
        </form>
      </div>
    </Layout>
  )
}