// El header: ahora también muestra quién está logueado.
// Sin sesión → el link a LA PUERTA (/login). Con sesión → el saludo, el color de tu pulsera y Salir.
import { Link } from 'react-router-dom'

export default function Header({ nombreTienda, cantidad, onAbrirCarrito, sesion, onSalir }) {
  return (
    <header className="header">
      <div className="header__inner">
        <Link className="logo" to="/" aria-label={`${nombreTienda} inicio`}>
          <span className="logo__marca">{nombreTienda}</span>
          <span className="logo__punto">.</span>
        </Link>
        <nav className="header__nav" aria-label="Principal">
          <span>Running</span>
          <span>Urbanas</span>
          <span>Básquet</span>
          <span className="header__sale">Sale</span>
        </nav>

        {sesion ? (
          <div className="cuenta-header" aria-label="Sesión">
            <span className="cuenta-header__saludo">
              Hola, <strong>{sesion.usuario.email}</strong>
            </span>
            <span className={`cuenta__rol cuenta__rol--${sesion.usuario.rol}`}>{sesion.usuario.rol}</span>
            <button className="cuenta__salir" onClick={onSalir}>
              Salir
            </button>
          </div>
        ) : (
          <Link className="header__ingresar" to="/login">
            Ingresar
          </Link>
        )}

        <button className="carrito-btn" onClick={onAbrirCarrito} aria-label={`Abrir carrito, ${cantidad} productos`}>
          🛒 <span className="carrito-btn__contador" data-testid="contador-carrito">{cantidad}</span>
        </button>
      </div>
    </header>
  )
}
