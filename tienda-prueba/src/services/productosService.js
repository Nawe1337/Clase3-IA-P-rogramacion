// 🔌 El ÚNICO archivo que sabe DE DÓNDE vienen los productos.
// Los componentes llaman a obtenerProductos() y no les importa si viene de un array o de una API.
import { productos } from '../data/productos.js'

export async function obtenerProductos() {
  // ── Fase 1 (hoy): datos locales ──
  return structuredClone(productos)

  // ── Fase 2 (backend): se reemplaza por esto ──
  // const res = await fetch(`${import.meta.env.VITE_API_URL}/productos`)
  // if (!res.ok) throw new Error('No se pudieron cargar los productos')
  // return res.json()
}
