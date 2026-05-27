import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NewPetPage from './pages/NewPetPage'
import EditPetPage from './pages/EditPetPage'
import PetDetailPage from './pages/PetDetailPage'
import MedicalForm from './components/medical/MedicalForm'
import ProfilePage from './pages/ProfilePage'
import EmergencyPage from './pages/EmergencyPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/emergencia/:token" element={<EmergencyPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/mascotas/nueva" element={
            <ProtectedRoute><NewPetPage /></ProtectedRoute>
          } />
          <Route path="/mascotas/:id" element={
            <ProtectedRoute><PetDetailPage /></ProtectedRoute>
          } />
          <Route path="/mascotas/:id/editar" element={
            <ProtectedRoute><EditPetPage /></ProtectedRoute>
          } />
          <Route path="/mascotas/:id/historial" element={
            <ProtectedRoute><MedicalForm /></ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}