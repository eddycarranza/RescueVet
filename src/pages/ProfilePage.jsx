import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/ui/Layout'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('owners').select('full_name, phone').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) setForm({ full_name: data.full_name ?? '', phone: data.phone ?? '' })
        setLoading(false)
      })
  }, [user.id])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('owners').update(form).eq('id', user.id)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Perfil actualizado ✓')
  }

  return (
    <Layout>
      <div className="px-4 pt-6">
        <h2 className="text-xl font-extrabold text-gray-900 mb-6">Mi perfil</h2>

        {/* Avatar / email */}
        <div className="card p-5 flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-2xl flex-shrink-0">
            👤
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">{form.full_name || 'Sin nombre'}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input type="text" placeholder="Tu nombre" className="input-field"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto</label>
              <input type="tel" placeholder="+54 11 1234-5678" className="input-field"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}

        {/* Datos de cuenta */}
        <div className="mt-6 card p-4">
          <p className="section-title">Cuenta</p>
          <p className="text-sm text-gray-500 mb-1">{user.email}</p>
          <p className="text-xs text-gray-300">
            Miembro desde {new Date(user.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>
    </Layout>
  )
}
