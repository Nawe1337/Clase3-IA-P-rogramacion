import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ProductCard from './components/ProductCard.jsx'
import Carrito from './components/Carrito.jsx'
import { obtenerProductos } from './services/productosService.js'
import { filtrarProductos, ordenarProductos } from './logic/filtros.js'
import { useCarrito } from './hooks/useCarrito.js'
import './App.css'

// CA-7.2: el nombre sale del .env (con valor por defecto si no está)
const NOMBRE_TIENDA = import.meta.env.VITE_NOMBRE_TIENDA || 'Pisada'

export default function App() {
  const [productos, setProductos] = useState([])
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [filtros, setFiltros] = useState({ texto: '', genero: 'todos', deporte: 'todos' })
  const [orden, setOrden] = useState('relevancia')
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const carrito = useCarrito()

  // Pedimos los productos al SERVICIO (hoy array local, mañana la API)
  useEffect(() => {
    obtenerProductos()
      .then((lista) => {
        setProductos(lista)
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [])

  const visibles = useMemo(() => ordenarProductos(filtrarProductos(productos, filtros), orden), [productos, filtros, orden])

  return (
    <>
      <div className="aviso">🚚 Envío gratis en compras desde $ 150.000 · Hasta 6 cuotas sin interés</div>
      <Header nombreTienda={NOMBRE_TIENDA} cantidad={carrito.cantidad} onAbrirCarrito={() => setCarritoAbierto(true)} />

      <main className="contenedor">
        <section className="hero">
          <div>
            <p className="hero__kicker">Temporada 2026</p>
            <h1 className="hero__titulo">
              Corré más.
              <br />
              <span>Pagá menos.</span>
            </h1>
            <p className="hero__bajada">Hasta 60% OFF en running, urbanas y básquet.</p>
          </div>
          <div className="hero__deco" aria-hidden="true">
            <span>-60%</span>
          </div>
        </section>

        <Filtros filtros={filtros} onCambiar={setFiltros} orden={orden} onOrden={setOrden} resultados={visibles.length} />

        {estado === 'cargando' && <p className="estado">Cargando zapatillas…</p>}
        {estado === 'error' && <p className="estado estado--error">No pudimos cargar el catálogo. Probá de nuevo.</p>}
        {estado === 'listo' && visibles.length === 0 && <p className="estado">No encontramos zapatillas con esos filtros</p>}

        <section className="grilla" aria-label="Catálogo">
          {visibles.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              onAgregar={(producto, talle) => {
                carrito.agregar(producto, talle)
                setCarritoAbierto(true)
              }}
            />
          ))}
        </section>
      </main>

      <footer className="pie">
        {NOMBRE_TIENDA} · tienda de prueba del curso Programación con IA · Fase 1: solo frontend
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
