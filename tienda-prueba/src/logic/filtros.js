import { porcentajeDescuento } from './formato.js'

// Saca acentos y pasa a minúsculas: "Ráfaga" → "rafaga"
function normalizar(texto = '') {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function filtrarProductos(productos, { texto = '', genero = 'todos', deporte = 'todos' } = {}) {
  const buscado = normalizar(texto)

  return productos.filter((p) => {
    const coincideTexto = buscado === '' || normalizar(`${p.nombre} ${p.marca}`).includes(buscado)
    const coincideGenero = genero === 'todos' || p.genero === genero || p.genero === 'unisex'
    const coincideDeporte = deporte === 'todos' || p.deporte === deporte
    return coincideTexto && coincideGenero && coincideDeporte
  })
}

export function ordenarProductos(productos, criterio = 'relevancia') {
  const copia = [...productos] // nunca tocamos el array original
  if (criterio === 'menor-precio') return copia.sort((a, b) => a.precio - b.precio)
  if (criterio === 'mayor-precio') return copia.sort((a, b) => b.precio - a.precio)
  if (criterio === 'descuento') {
    return copia.sort(
      (a, b) => porcentajeDescuento(b.precio, b.precioAnterior) - porcentajeDescuento(a.precio, a.precioAnterior),
    )
  }
  return copia
}
