import { useEffect, useState } from 'react'
import { agregarAlCarrito, cambiarCantidad, quitarDelCarrito, totalCarrito, cantidadTotal } from '../logic/carrito.js'

const CLAVE = 'pisada-carrito'

function leerGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? []
  } catch {
    return []
  }
}

// Hook = estado del carrito + guardado en localStorage (CA-6.5).
// La lógica de verdad está en logic/carrito.js (testeada aparte).
export function useCarrito() {
  const [carrito, setCarrito] = useState(leerGuardado)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(carrito))
    } catch {
      /* modo privado o storage bloqueado: seguimos sin guardar */
    }
  }, [carrito])

  return {
    carrito,
    total: totalCarrito(carrito),
    cantidad: cantidadTotal(carrito),
    agregar: (producto, talle) => setCarrito((c) => agregarAlCarrito(c, producto, talle)),
    sumar: (id, talle) => setCarrito((c) => cambiarCantidad(c, id, talle, +1)),
    restar: (id, talle) => setCarrito((c) => cambiarCantidad(c, id, talle, -1)),
    quitar: (id, talle) => setCarrito((c) => quitarDelCarrito(c, id, talle)),
    vaciar: () => setCarrito([]),
  }
}
