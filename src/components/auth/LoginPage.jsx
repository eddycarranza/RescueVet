import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Shield, QrCode, Heart, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

const FEATURES = [
  { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', title: 'Historial Centralizado', text: 'Todo el historial médico de tu mascota en un solo lugar, siempre disponible.' },
  { icon: QrCode, color: 'text-blue-500', bg: 'bg-blue-50', title: 'QR de Emergencia', text: 'Acceso inmediato a datos vitales sin necesidad de iniciar sesión.' },
  { icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Controlado por vos', text: 'Los datos son tuyos. Vos decidís qué información compartir y con quién.' },
  { icon: Lock, color: 'text-violet-500', bg: 'bg-violet-50', title: 'Privacidad Total', text: 'Niveles de acceso diferenciados para proteger tu información personal.' },
]

const STEPS = [
  { number: '01', title: 'Creá tu cuenta', text: 'Registrate en segundos con tu email.' },
  { number: '02', title: 'Registrá tu mascota', text: 'Cargá foto, especie, raza y datos básicos.' },
  { number: '03', title: 'Cargá el historial', text: 'Alergias, vacunas, cirugías y anotaciones.' },
  { number: '04', title: 'Compartí el QR', text: 'Cualquier veterinario lo escanea y accede al instante.' },
]

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
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : error.message
      )
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-extrabold text-slate-800 text-xl">RescueVet</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/registro" className="text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors px-3 py-2">
              Crear cuenta
            </Link>
            <button
              onClick={() => document.getElementById('login-form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* ── SECCIÓN 1: HERO ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24 lg:grid lg:grid-cols-2 lg:gap-16 items-center">
        {/* Texto */}
        <div>
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            🐾 DNI Digital para Mascotas
          </span>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            El historial médico que
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400"> salva vidas</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
            Centralizá el historial médico de tu mascota y compartilo con cualquier veterinario en segundos mediante un simple código QR.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/registro"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg text-base"
            >
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => document.getElementById('login-form').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold px-8 py-4 rounded-2xl border border-gray-200 hover:shadow-md transition-all text-base"
            >
              Ya tengo cuenta
            </button>
          </div>
          {/* Trust badges */}
          <div className="mt-10 flex items-center gap-6 text-slate-400 text-sm">
            {['Sin tarjeta de crédito', 'Acceso inmediato', 'Datos seguros'].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="hidden lg:flex items-center justify-center mt-12 lg:mt-0">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-8xl">🐾</div>
                <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
                  <p className="text-xs text-slate-400 mb-1">Mascota registrada</p>
                  <p className="font-extrabold text-slate-800">Max · Labrador</p>
                  <p className="text-xs text-emerald-500 font-medium mt-1">✓ Historial completo</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100">
              <p className="text-xs text-slate-400">Vacunas</p>
              <p className="font-bold text-slate-800 text-sm">Al día ✓</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100">
              <p className="text-xs text-slate-400">QR Activo</p>
              <p className="font-bold text-blue-500 text-sm">Escaneable 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: FEATURES ─────────────────────────────── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3">
              Todo lo que necesitás en un lugar
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Diseñado para dueños que quieren lo mejor para su mascota
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bg}`}>
                    <Icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: CÓMO FUNCIONA ────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3">
              Empezá en 4 pasos simples
            </h2>
            <p className="text-slate-500 text-lg">Sin instalaciones ni configuraciones complejas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
                  <span className="text-white font-extrabold text-lg">{s.number}</span>
                </div>
                <h3 className="font-extrabold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: FORMULARIO LOGIN ─────────────────────── */}
      <section id="login-form" className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6 lg:grid lg:grid-cols-2 lg:gap-16 items-center">

          {/* Texto lateral */}
          <div className="hidden lg:block">
            <h2 className="text-4xl font-extrabold text-slate-800 leading-tight mb-6">
              Tu mascota te espera.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
                Ingresá ahora.
              </span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Accedé a todos los perfiles, historiales médicos y códigos QR de tus mascotas desde un solo panel.
            </p>
            <div className="space-y-3">
              {['Perfiles ilimitados de mascotas', 'Historial médico completo', 'QR de emergencia activo 24/7', 'Acceso desde cualquier dispositivo'].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-600 font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card login */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-10 mt-10 lg:mt-0">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="text-xl">🐾</span>
                <span className="font-extrabold text-slate-800">RescueVet</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Iniciá sesión</h2>
              <p className="text-slate-400 text-sm">Ingresá con tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-400 hover:opacity-90 active:scale-95 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100 text-sm mt-2"
              >
                {loading ? 'Ingresando...' : 'Entrar'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-300 text-xs">RescueVet</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-sm text-slate-400">
              No tenés cuenta?{' '}
              <Link to="/registro" className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
                Registrate gratis
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <p className="text-center text-slate-300 text-sm">
          © {new Date().getFullYear()} RescueVet — PE
        </p>
      </footer>

    </div>
  )
}