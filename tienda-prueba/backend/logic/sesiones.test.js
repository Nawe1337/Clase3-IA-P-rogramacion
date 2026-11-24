// Tests de la lógica de sesiones (funciones puras → TDD).
// Corren en Node (no en jsdom) porque usan node:crypto.
// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { hashContrasenia, verificarContrasenia, generarToken, esAdmin, extraerToken } from './sesiones.js'

describe('hashContrasenia (la huella)', () => {
  it('devuelve "sal:hash": la sal viaja pegada al hash', () => {
    const guardado = hashContrasenia('hola123')
    expect(guardado).toMatch(/^[0-9a-f]+:[0-9a-f]+$/)
  })

  it('misma contraseña + misma sal → mismo hash (determinístico para verificar)', () => {
    expect(hashContrasenia('hola123', 'salvador')).toBe(hashContrasenia('hola123', 'salvador'))
  })

  it('misma contraseña + otra sal → OTRO hash (dos usuarios con la misma contraseña no se parecen)', () => {
    expect(hashContrasenia('hola123', 'sal1')).not.toBe(hashContrasenia('hola123', 'sal2'))
  })
})

describe('verificarContrasenia (el portero compara huellas)', () => {
  it('contraseña correcta → true', () => {
    const guardado = hashContrasenia('gato negro')
    expect(verificarContrasenia('gato negro', guardado)).toBe(true)
  })

  it('contraseña incorrecta → false', () => {
    const guardado = hashContrasenia('gato negro')
    expect(verificarContrasenia('gato blanco', guardado)).toBe(false)
  })

  it('dato guardado corrupto → false (no explota)', () => {
    expect(verificarContrasenia('lo que sea', 'no-soy-un-hash')).toBe(false)
    expect(verificarContrasenia('lo que sea', null)).toBe(false)
  })
})

describe('generarToken (la pulsera)', () => {
  it('genera tokens largos y únicos', () => {
    const t1 = generarToken()
    const t2 = generarToken()
    expect(t1).toMatch(/^[0-9a-f]{40,}$/)
    expect(t1).not.toBe(t2)
  })
})

describe('esAdmin (el color de la pulsera)', () => {
  it('rol admin → true', () => {
    expect(esAdmin({ email: 'a@a', rol: 'admin' })).toBe(true)
  })

  it('rol cliente → false', () => {
    expect(esAdmin({ email: 'a@a', rol: 'cliente' })).toBe(false)
  })

  it('sin usuario → false', () => {
    expect(esAdmin(null)).toBe(false)
    expect(esAdmin(undefined)).toBe(false)
  })
})

describe('extraerToken (lee el header Authorization)', () => {
  it('con "Bearer " → devuelve el token pelado', () => {
    expect(extraerToken('Bearer abc123')).toBe('abc123')
  })

  it('sin "Bearer" también lo acepta (tolerante)', () => {
    expect(extraerToken('abc123')).toBe('abc123')
  })

  it('header ausente o vacío → null', () => {
    expect(extraerToken(undefined)).toBe(null)
    expect(extraerToken('')).toBe(null)
    expect(extraerToken('Bearer ')).toBe(null)
  })
})
