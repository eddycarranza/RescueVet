# 🐾 RescueVet — Guía de Setup

## 1. Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecutá el archivo `rescuevet_schema.sql` (está en la raíz del repo)
3. Ve a **Project Settings → API** y copiá:
   - `Project URL`
   - `anon / public key`

## 2. Variables de entorno

Renombrá `.env.example` a `.env.local` y completá:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_APP_URL=http://localhost:5173   # En producción: https://tuapp.vercel.app
```

## 3. Instalar y correr

```bash
npm install
npm run dev
```

Abrí http://localhost:5173

## 4. Deploy en Vercel

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel
vercel

# O simplemente conectá el repo en vercel.com
# Acordate de agregar las variables de entorno en:
# Vercel Dashboard → Project → Settings → Environment Variables
```

Variables a agregar en Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL` → tu URL de Vercel (ej: https://rescuevet.vercel.app)

## Estructura del proyecto

```
src/
├── components/
│   ├── auth/        # Login, Registro, ProtectedRoute
│   ├── medical/     # Formulario de historial médico
│   ├── pets/        # Formulario CRUD de mascotas
│   ├── qr/          # Generador y descarga de QR
│   └── ui/          # Layout, Navbar
├── context/
│   └── AuthContext  # Sesión global con Supabase Auth
├── lib/
│   └── supabase.js  # Cliente de Supabase
└── pages/
    ├── DashboardPage    # Home con listado de mascotas
    ├── PetDetailPage    # Detalle + QR + historial
    ├── EmergencyPage    # Vista pública del QR (sin login)
    └── ProfilePage      # Perfil del dueño
```

## Flujo de la app

```
Registro/Login → Dashboard → Nueva mascota → Cargar historial → Ver QR
                                                                   ↓
                                              /emergencia/:token (público, sin login)
```
