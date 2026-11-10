import { describe, it, expect } from 'vitest'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito, totalCarrito, cantidadTotal } from './carrito.js'

const zapa = { id: 1, nombre: 'Velox Ráfaga 3', precio: 1000 }
const otra = { id: 2, nombre: 'Aro Volcada', precio: 500 }

describe('carrito (R6)', () => {
  it('CA-6.1 agregar suma una línea con cantidad 1', () => {
    const c = agregarAlCarrito([], zapa, 38)
    expect(c).toEqual([{ id: 1, nombre: 'Velox Ráfaga 3', precio: 1000, talle: 38, cantidad: 1 }])
  })
  it('CA-6.2 mismo producto y talle suma cantidad', () => {
    let c = agregarAlCarrito([], zapa, 38)
    c = agregarAlCarrito(c, zapa, 38)
    expect(c).toHaveLength(1)
    expect(c[0].cantidad).toBe(2)
  })
  it('CA-6.2 otro talle es otra línea', () => {
    let c = agregarAlCarrito([], zapa, 38)
    c = agregarAlCarrito(c, zapa, 39)
    expect(c).toHaveLength(2)
  })
  it('no modifica el carrito original (inmutable)', () => {
    const original = agregarAlCarrito([], zapa, 38)
    agregarAlCarrito(original, zapa, 38)
    expect(original[0].cantidad).toBe(1)
  })
  it('CA-6.3 cambiar cantidad +1 / -1 y quitar al llegar a 0', () => {
    let c = agregarAlCarrito([], zapa, 38)
    c = cambiarCantidad(c, 1, 38, +1)
    expect(c[0].cantidad).toBe(2)
    c = cambiarCantidad(c, 1, 38, -1)
    c = cambiarCantidad(c, 1, 38, -1)
    expect(c).toEqual([])
  })
  it('CA-6.3 quitar una línea', () => {
    let c = agregarAlCarrito([], zapa, 38)
    c = agregarAlCarrito(c, otra, 42)
    c = quitarDelCarrito(c, 1, 38)
    expect(c.map((l) => l.id)).toEqual([2])
  })
  it('CA-6.4 total y cantidad total', () => {
    let c = agregarAlCarrito([], zapa, 38)
    c = agregarAlCarrito(c, zapa, 38)
    c = agregarAlCarrito(c, otra, 42)
    expect(totalCarrito(c)).toBe(2500)
    expect(cantidadTotal(c)).toBe(3)
    expect(totalCarrito([])).toBe(0)
  })
})
