import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🐾</div>
          <p className="text-brand-600 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
