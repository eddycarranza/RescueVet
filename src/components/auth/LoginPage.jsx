import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(form)
    setLoading(false)
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex flex-col justify-center px-6 py-12">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-3xl">🐾</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">RescueVet</h1>
        <p className="text-gray-500 text-sm mt-1">El DNI digital de tu mascota</p>
      </div>

      <div className="card p-6 max-w-sm mx-auto w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="tu@email.com"
              className="input-field"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="input-field"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="text-brand-600 font-semibold hover:underline">
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
