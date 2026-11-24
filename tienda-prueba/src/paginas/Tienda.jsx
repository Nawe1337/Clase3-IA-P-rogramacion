// 👟 LA TIENDA (URL: /) — el catálogo público, como siempre.
// Acá no se enteran de login ni roles: cualquiera entra, mira y compra.
import { useCallback, useEffect, useMemo, useState } from 'react'
import Filtros from '../components/Filtros.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { obtenerProductos } from '../services/productosService.js'
import { filtrarProductos, ordenarProductos } from '../logic/filtros.js'

export default function Tienda({ onAgregar }) {
  const [productos, setProductos] = useState([])
  const [estado, setEstado] = useState('cargando') // 'cargando' | 'listo' | 'error'
  const [filtros, setFiltros] = useState({ texto: '', genero: 'todos', deporte: 'todos' })
  const [orden, setOrden] = useState('relevancia')

  // Pedimos los productos al SERVICIO (Fase 2: le pega a la API del backend)
  const recargar = useCallback(() => {
    return obtenerProductos()
      .then((lista) => {
        setProductos(lista)
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  const visibles = useMemo(() => ordenarProductos(filtrarProductos(productos, filtros), orden), [productos, filtros, orden])

  return (
    <>
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
          <ProductCard key={p.id} producto={p} onAgregar={onAgregar} />
        ))}
      </section>
    </>
  )
}
