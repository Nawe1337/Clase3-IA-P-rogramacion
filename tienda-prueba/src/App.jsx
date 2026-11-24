// 🏠 El casco de la casa: header fijo + URLs + carrito lateral.
// Las URLs (react-router) son los lugares de la casa:
//   /        → la tienda (el catálogo público)
//   /login   → la puerta (donde entregan la pulsera)
//   /admin   → el depósito (SOLO con pulsera VIP)
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Carrito from './components/Carrito.jsx'
import Tienda from './paginas/Tienda.jsx'
import PaginaLogin from './paginas/PaginaLogin.jsx'
import PaginaAdmin from './paginas/PaginaAdmin.jsx'
import { useCarrito } from './hooks/useCarrito.js'
import { useSesion } from './hooks/useSesion.js'
import './App.css'

const NOMBRE_TIENDA = import.meta.env.VITE_NOMBRE_TIENDA || 'Pisada'

export default function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const carrito = useCarrito()

  // La sesión vive acá (arriba de todo): el header, la puerta y el guardia la usan
  const { sesion, entrar, salir } = useSesion()
  const esAdmin = sesion?.usuario?.rol === 'admin'

  const agregarAlCarrito = (producto, talle) => {
    carrito.agregar(producto, talle)
    setCarritoAbierto(true) // como en toda tienda: agregás y se abre el carrito
  }

  return (
    <>
      <div className="aviso">🚚 Envío gratis en compras desde $ 150.000 · Hasta 6 cuotas sin interés</div>
      <Header
        nombreTienda={NOMBRE_TIENDA}
        cantidad={carrito.cantidad}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        sesion={sesion}
        onSalir={salir}
      />

      <main className="contenedor">
        <Routes>
          {/* La tienda: el catálogo público (como siempre) */}
          <Route path="/" element={<Tienda onAgregar={agregarAlCarrito} />} />

          {/* La puerta: si ya tenés la pulsera, no tiene sentido volver a entrar */}
          <Route
            path="/login"
            element={sesion ? <Navigate to={esAdmin ? '/admin' : '/'} replace /> : <PaginaLogin onEntrar={entrar} />}
          />

          {/* El depósito: SOLO admin. Si no, te manda a la puerta */}
          <Route path="/admin" element={esAdmin ? <PaginaAdmin /> : <Navigate to="/login" replace />} />

          {/* Cualquier otra URL → a la tienda */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="pie">
        {NOMBRE_TIENDA} · tienda de prueba del curso Programación con IA · Fase 2: front + API + login
      </footer>

      <Carrito
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
        carrito={carrito.carrito}
        total={carrito.total}
        onSumar={carrito.sumar}
        onRestar={carrito.restar}
        onQuitar={carrito.quitar}
        onVaciar={carrito.vaciar}
      />
    </>
  )
}
