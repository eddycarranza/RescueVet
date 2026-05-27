import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/mascotas/nueva', icon: '➕', label: 'Agregar' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

export default function Layout({ children }) {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* SIDEBAR — solo desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen sticky top-0 h-screen">
        <Link to="/dashboard" className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <span className="text-2xl">🐾</span>
          <span className="font-extrabold text-brand-700 text-xl">RescueVet</span>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.to
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors
                  ${active ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors w-full">
            <span className="text-lg">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Header — solo mobile */}
        <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-extrabold text-brand-700 text-lg">RescueVet</span>
          </Link>
          <button onClick={handleSignOut} className="text-gray-400 hover:text-gray-600 text-sm font-medium">
            Salir
          </button>
        </header>

        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* BOTTOM NAV — solo mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-30">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium transition-colors
                ${active ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}>
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}