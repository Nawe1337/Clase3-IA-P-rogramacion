import { useState } from 'react'
import Zapatilla from './Zapatilla.jsx'
import { formatearPrecio, porcentajeDescuento } from '../logic/formato.js'

const GENERO = { hombre: 'Hombre', mujer: 'Mujer', unisex: 'Unisex' }

export default function ProductCard({ producto, onAgregar }) {
  const [talle, setTalle] = useState(null)
  const { nombre, marca, genero, deporte, precio, precioAnterior, cuotas, talles, color, nuevo } = producto
  const descuento = porcentajeDescuento(precio, precioAnterior)
  const titulo = `${nombre} ${GENERO[genero]}`

  return (
    <article className="card" aria-label={titulo}>
      <div className="card__foto" style={{ '--tinte': color }}>
        <div className="card__badges">
          {descuento > 0 && <span className="badge badge--off">-{descuento}% OFF</span>}
          {nuevo && <span className="badge badge--nuevo">NUEVO</span>}
        </div>
        <Zapatilla color={color} className="card__zapa" />
      </div>

      <div className="card__info">
        <p className="card__marca">
          {marca} · {GENERO[genero]} · {deporte}
        </p>
        <h3 className="card__nombre">{nombre}</h3>
        <p className="card__precios">
          <span className="card__precio">{formatearPrecio(precio)}</span>
          {descuento > 0 && <s className="card__anterior">{formatearPrecio(precioAnterior)}</s>}
        </p>
        <p className="card__cuotas">
          {cuotas} cuotas sin interés de <strong>{formatearPrecio(precio / cuotas)}</strong>
        </p>

        <div className="talles" role="group" aria-label={`Talles de ${titulo}`}>
          {talles.map((t) => (
            <button key={t} className="talle" aria-pressed={talle === t} onClick={() => setTalle(t)}>
              {t}
            </button>
          ))}
        </div>

        <button className="agregar" disabled={talle === null} onClick={() => onAgregar(producto, talle)} aria-label={`Agregar ${titulo}`}>
          {talle === null ? 'Elegí tu talle' : `Agregar talle ${talle}`}
        </button>
      </div>
    </article>
  )
}
