import { describe, it, expect } from 'vitest'
import { formatearPrecio, porcentajeDescuento } from './formato.js'

describe('formatearPrecio (CA-1.2)', () => {
  it('formatea en pesos con punto de miles', () => {
    expect(formatearPrecio(89999)).toBe('$ 89.999')
    expect(formatearPrecio(219999)).toBe('$ 219.999')
  })
  it('funciona con números chicos y con cero', () => {
    expect(formatearPrecio(500)).toBe('$ 500')
    expect(formatearPrecio(0)).toBe('$ 0')
  })
})

describe('porcentajeDescuento (CA-1.3)', () => {
  it('calcula el % OFF redondeado', () => {
    expect(porcentajeDescuento(89999, 129999)).toBe(31)
    expect(porcentajeDescuento(124999, 309999)).toBe(60)
  })
  it('devuelve 0 si no hay precio anterior o no es mayor', () => {
    expect(porcentajeDescuento(59999, null)).toBe(0)
    expect(porcentajeDescuento(100, 100)).toBe(0)
  })
})
