import { formatearPrecio } from '../logic/formato.js'
import Zapatilla from './Zapatilla.jsx'

export default function Carrito({ abierto, onCerrar, carrito, total, onSumar, onRestar, onQuitar, onVaciar }) {
  return (
    <>
      <div className={`velo ${abierto ? 'velo--on' : ''}`} onClick={onCerrar} />
      <aside className={`carrito ${abierto ? 'carrito--on' : ''}`} aria-label="Carrito" inert={!abierto}>
        <div className="carrito__top">
          <h2>Tu carrito</h2>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {carrito.length === 0 ? (
          <p className="carrito__vacio">Todavía no agregaste zapatillas 👟</p>
        ) : (
          <ul className="carrito__lista">
            {carrito.map((l) => (
              <li key={`${l.id}-${l.talle}`} className="linea">
                <Zapatilla color={l.color} className="linea__zapa" />
                <div className="linea__info">
                  <strong>{l.nombre}</strong>
                  <span className="muted">
                    Talle {l.talle} · {formatearPrecio(l.precio)}
                  </span>
                  <div className="linea__cant">
                    <button onClick={() => onRestar(l.id, l.talle)} aria-label={`Restar ${l.nombre} talle ${l.talle}`}>
                      −
                    </button>
                    <span data-testid={`cantidad-${l.id}-${l.talle}`}>{l.cantidad}</span>
                    <button onClick={() => onSumar(l.id, l.talle)} aria-label={`Sumar ${l.nombre} talle ${l.talle}`}>
                      +
                    </button>
                    <button className="linea__quitar" onClick={() => onQuitar(l.id, l.talle)}>
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="carrito__pie">
          <p className="carrito__total">
            Total <span data-testid="total-carrito">{formatearPrecio(total)}</span>
          </p>
          <div className="carrito__acciones">
            <button className="vaciar" onClick={onVaciar} disabled={carrito.length === 0}>
              Vaciar
            </button>
            <button className="comprar" disabled title="Llega en la Fase 2 (backend)">
              Finalizar compra · Fase 2
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
