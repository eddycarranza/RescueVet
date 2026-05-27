import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

export default function QRSection({ pet }) {
  const qrRef = useRef()
  const appUrl = import.meta.env.VITE_APP_URL ?? window.location.origin
  const emergencyUrl = `${appUrl}/emergencia/${pet.qr_token}`

  const handleDownload = () => {
    try {
      const svg = qrRef.current.querySelector('svg')
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const size = 512
      canvas.width = size
      canvas.height = size + 60

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const img = new Image()
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size)
        ctx.fillStyle = '#166534'
        ctx.font = 'bold 22px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`RescueVet — ${pet.name}`, size / 2, size + 38)

        const link = document.createElement('a')
        link.download = `qr-rescuevet-${pet.name.toLowerCase()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        URL.revokeObjectURL(url)
        toast.success('QR descargado')
      }
      img.src = url
    } catch {
      toast.error('No se pudo descargar el QR')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emergencyUrl)
      toast.success('Link copiado al portapapeles')
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📱</span>
        <h4 className="font-bold text-gray-900">QR de Emergencia</h4>
      </div>

      <p className="text-xs text-gray-400 mb-5 leading-relaxed">
        Imprimí y pegá este QR en el collar de <strong className="text-gray-600">{pet.name}</strong>.
        Cualquier veterinario podrá escanear y ver sus datos vitales sin necesidad de iniciar sesión.
      </p>

      {/* QR */}
      <div ref={qrRef} className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-block">
          <QRCodeSVG
            value={emergencyUrl}
            size={200}
            level="H"
            includeMargin={false}
            fgColor="#14532d"
            bgColor="#ffffff"
            imageSettings={{
              src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMjQiPvCfkLoiPC90ZXh0Pjwvc3ZnPg==",
              height: 32,
              width: 32,
              excavate: true,
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 font-mono break-all text-center px-2">
          {emergencyUrl}
        </p>
      </div>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button onClick={handleDownload}
          className="flex items-center justify-center gap-2 bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 active:scale-95 transition-all text-sm">
          ⬇️ Descargar
        </button>
        <button onClick={handleCopy}
          className="flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold py-3 rounded-xl border-2 border-brand-200 hover:border-brand-400 active:scale-95 transition-all text-sm">
          🔗 Copiar link
        </button>
      </div>

      {/* Nota de emergencia */}
      <div className="mt-4 bg-emergency-50 border border-emergency-100 rounded-xl p-3 flex gap-2">
        <span className="text-base">🚨</span>
        <p className="text-xs text-red-600 leading-relaxed">
          <strong>Vista de emergencia:</strong> Solo muestra foto, nombre, alergias y cirugías. Los datos personales permanecen protegidos.
        </p>
      </div>
    </div>
  )
}
