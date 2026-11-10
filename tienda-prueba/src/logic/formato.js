// Funciones puras de formato. Sin React, sin DOM: fáciles de testear.

export function formatearPrecio(valor) {
  // "es-AR" usa punto para los miles: 89999 → "89.999"
  return '$ ' + Math.round(valor).toLocaleString('es-AR')
}

export function porcentajeDescuento(precio, precioAnterior) {
  if (!precioAnterior || precioAnterior <= precio) return 0
  return Math.round((1 - precio / precioAnterior) * 100)
}
