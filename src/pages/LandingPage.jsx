import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Importación directa a Supabase agregada
import { Check, ShieldCheck, Smartphone, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor ingresa tu email y contraseña');
      return;
    }
    
    setLoading(true);
    try {
      // Llamada nativa a Supabase v2 estructurada correctamente
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast.error('Credenciales incorrectas');
        console.error("Error devuelto por Supabase:", error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Ocurrió un error interno al conectar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToLogin = () => {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDF9] font-sans">
      {/* 1. Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">RescueVet</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/register')}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Crear cuenta
          </button>
          <button 
            onClick={handleScrollToLogin}
            className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all active:scale-95"
          >
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* 2. Bloque 1: Hero Section (Split Screen) */}
      <main className="max-w-7xl mx-auto px-8 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
        {/* Mitad Izquierda: Texto */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-blue-100">
            <span>🐾</span> DNI Digital para Mascotas
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            El historial médico que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
              salva vidas
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            Centraliza el historial médico de tu mascota y compártelo con cualquier veterinario en segundos mediante un simple código QR.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={() => navigate('/register')}
              className="bg-emerald-400 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Comenzar gratis
              <span className="text-xl">→</span>
            </button>
            <button 
              onClick={handleScrollToLogin}
              className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center"
            >
              Ya tengo cuenta
            </button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Sin tarjeta de crédito
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Acceso inmediato
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Datos seguros
            </div>
          </div>
        </div>

        {/* Mitad Derecha: Ilustración UI */}
        <div className="relative w-full aspect-square md:aspect-[4/3] bg-emerald-50 rounded-[2.5rem] flex items-center justify-center shadow-inner border border-emerald-100">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 text-9xl">
            🐾
          </div>
          
          {/* Tarjeta Flotante 1 */}
          <div className="absolute top-12 right-8 md:right-16 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce" style={{animationDuration: '3s'}}>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Vacunas</p>
            <p className="text-sm font-extrabold text-slate-800">Al día ✓</p>
          </div>

          {/* Tarjeta Flotante Principal */}
          <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 max-w-xs w-full mx-auto transform hover:scale-105 transition-transform duration-300">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1 text-center">Mascota registrada</p>
            <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2">Max · Labrador</h3>
            <div className="flex items-center justify-center gap-1.5 text-emerald-500 text-sm font-bold bg-emerald-50 py-1.5 px-3 rounded-lg w-fit mx-auto">
              <Check className="w-4 h-4" />
              Historial completo
            </div>
          </div>

          {/* Tarjeta Flotante 3 */}
          <div className="absolute bottom-16 left-8 md:left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">QR Activo</p>
            <p className="text-sm font-extrabold text-blue-600">Escaneable 24/7</p>
          </div>
        </div>
      </main>

      {/* 3. Bloque 2: Sección de Inicio de Sesión */}
      <section id="login-section" className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Lado Izquierdo: Beneficios de Login */}
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Tu mascota te espera. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">
                Ingresa ahora.
              </span>
            </h2>
            <p className="text-lg text-slate-500 max-w-md pb-4">
              Accede a todos los perfiles, historiales médicos y códigos QR de tus mascotas desde un solo panel.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                Perfiles ilimitados de mascotas
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                Historial médico completo
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                </div>
                QR de emergencia activo 24/7
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                </div>
                Acceso desde cualquier dispositivo
              </li>
            </ul>
          </div>

          {/* Lado Derecho: Formulario de Login */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Inicia sesión</h3>
              <p className="text-slate-500 text-sm">Ingresa con tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Regístrate gratis
                </button>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-8 text-center border-t border-slate-100 bg-[#FDFDF9]">
        <p className="text-sm font-medium text-slate-400">
          © 2026 RescueVet — Desarrollado en Perú
        </p>
      </footer>
    </div>
  );
}