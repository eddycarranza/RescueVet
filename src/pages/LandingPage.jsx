import { Link } from 'react-router-dom'
import { Camera, Syringe, Smartphone, Building2, Info, Rocket } from 'lucide-react'

const FEATURES = [
  { icon: Camera, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Sube tus Carnets', text: 'Toma una foto de los carnets fisicos de vacunacion y nosotros los guardamos de forma segura.' },
  { icon: Syringe, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Vacunas Estandarizadas', text: 'Selecciona vacunas de un catalogo estandar peruano. Sin errores de tipeo ni datos desordenados.' },
  { icon: Smartphone, color: 'text-slate-800', bg: 'bg-slate-100', title: 'Codigo QR Unico', text: 'Cada mascota recibe un QR que cualquier veterinario puede escanear para ver su historial completo.' },
  { icon: Building2, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Independiente', text: 'Registrate sin importar si tu clinica esta afiliada. Tu informacion es tuya, siempre.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F3E9] text-slate-800">
      <nav className="sticky top-0 z-50 bg-[#F5F3E9]/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-extrabold text-slate-800 text-xl">RescueVet</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 font-medium text-sm hover:text-slate-900 px-3 py-2">Iniciar Sesion</Link>
            <Link to="/registro" className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all">Crear Cuenta</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-4xl">🐶</span>
          <span className="text-4xl">🐱</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
          El historial medico <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">digital</span> de tu mascota
        </h1>
        <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Digitaliza los carnets de vacunacion, registra alergias y enfermedades, y comparte toda la informacion de tu mascota con cualquier veterinario mediante un simple codigo QR.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/registro" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg text-base w-full sm:w-auto justify-center">
            <Rocket className="w-5 h-5" />
            Comenzar Gratis
          </Link>
          <a href="#features" className="inline-flex items-center gap-2 bg-white text-slate-700 font-bold px-8 py-4 rounded-2xl border border-stone-200 hover:shadow-md active:scale-95 transition-all text-base w-full sm:w-auto justify-center">
            <Info className="w-5 h-5 text-slate-400" />
            Conocer Mas
          </a>
        </div>
        <div className="mt-10 flex items-center justify-center gap-3 text-slate-400 text-sm flex-wrap">
          <div className="flex -space-x-2">
            {['🐶','🐱','🐰','🐦','🐾'].map((e, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-[#F5F3E9] flex items-center justify-center text-base shadow-sm">{e}</div>
            ))}
          </div>
          <span>+2,000 mascotas ya tienen su historial digital</span>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
            Por que <span className="text-blue-500">RescueVet</span>?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Tu mascota merece un historial medico organizado y siempre accesible</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className={"w-16 h-16 rounded-2xl flex items-center justify-center mb-5 " + f.bg}>
                  <Icon className={"w-8 h-8 " + f.color} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 mt-4 mb-24 text-center">
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-slate-700" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4">Eres una clinica veterinaria en Peru?</h2>
          <p className="text-slate-500 text-base leading-relaxed mb-8">
            Ofrece a tus clientes el historial digital como herramienta de fidelizacion por solo <span className="text-blue-600 font-bold">S/ 29 mensuales</span>.
          </p>
          <Link to="/registro" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg text-base">
            Solicitar Demo
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8">
        <p className="text-center text-slate-400 text-sm">© $(Get-Date -Format yyyy) RescueVet — Desarrollado en Peru</p>
      </footer>
    </div>
  )
}