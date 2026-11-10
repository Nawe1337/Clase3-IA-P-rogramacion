// El carrito es un array de líneas: { id, nombre, precio, talle, cantidad, ... }
// Todas las funciones devuelven un carrito NUEVO (no modifican el anterior).

const esLinea = (linea, id, talle) => linea.id === id && linea.talle === talle

export function agregarAlCarrito(carrito, producto, talle) {
  const existe = carrito.some((l) => esLinea(l, producto.id, talle))
  if (existe) {
    return carrito.map((l) => (esLinea(l, producto.id, talle) ? { ...l, cantidad: l.cantidad + 1 } : l))
  }
  return [...carrito, { ...producto, talle, cantidad: 1 }]
}

export function cambiarCantidad(carrito, id, talle, delta) {
  return carrito
    .map((l) => (esLinea(l, id, talle) ? { ...l, cantidad: l.cantidad + delta } : l))
    .filter((l) => l.cantidad > 0)
}

export function quitarDelCarrito(carrito, id, talle) {
  return carrito.filter((l) => !esLinea(l, id, talle))
}

export function totalCarrito(carrito) {
  return carrito.reduce((suma, l) => suma + l.precio * l.cantidad, 0)
}

export function cantidadTotal(carrito) {
  return carrito.reduce((suma, l) => suma + l.cantidad, 0)
}
