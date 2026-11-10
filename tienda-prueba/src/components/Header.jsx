export default function Header({ nombreTienda, cantidad, onAbrirCarrito }) {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="logo" href="/" aria-label={`${nombreTienda} inicio`}>
          <span className="logo__marca">{nombreTienda}</span>
          <span className="logo__punto">.</span>
        </a>
        <nav className="header__nav" aria-label="Principal">
          <span>Running</span>
          <span>Urbanas</span>
          <span>Básquet</span>
          <span className="header__sale">Sale</span>
        </nav>
        <button className="carrito-btn" onClick={onAbrirCarrito} aria-label={`Abrir carrito, ${cantidad} productos`}>
          🛒 <span className="carrito-btn__contador" data-testid="contador-carrito">{cantidad}</span>
        </button>
      </div>
    </header>
  )
}
