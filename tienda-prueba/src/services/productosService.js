// 🔌 El ÚNICO archivo que sabe DE DÓNDE vienen los productos.
// Fase 2 (la mudanza): ahora le pega a la API del backend (:3001).
// Los componentes siguen llamando obtenerProductos() como siempre: no notaron el cambio.
import { leerSesion } from './sesionesService.js'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Las escrituras viajan con la pulsera puesta (header Authorization).
function headersConPulsera(extra = {}) {
  const sesion = leerSesion()
  return {
    ...extra,
    ...(sesion?.token ? { Authorization: `Bearer ${sesion.token}` } : {}),
  }
}

// Si la API contesta con error (401, 403…), mostramos SU mensaje:
// así el portero te dice por qué no te dejó pasar.
async function errorDeRespuesta(res) {
  let mensaje = `Error ${res.status}`
  try {
    const datos = await res.json()
    if (datos?.error) mensaje = datos.error
  } catch {
    // respuesta sin JSON — dejamos el mensaje genérico
  }
  throw new Error(mensaje)
}

export async function obtenerProductos() {
  const res = await fetch(`${API}/productos`) // el catálogo es público: sin pulsera
  if (!res.ok) throw new Error('No se pudieron cargar los productos')
  return res.json()
}

export async function actualizarProducto(id, cambios) {
  const res = await fetch(`${API}/productos/${id}`, {
    method: 'PUT',
    headers: headersConPulsera({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(cambios),
  })
  if (!res.ok) await errorDeRespuesta(res)
  return res.json()
}

export async function crearProducto(datos) {
  const res = await fetch(`${API}/productos`, {
    method: 'POST',
    headers: headersConPulsera({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(datos),
  })
  if (!res.ok) await errorDeRespuesta(res)
  return res.json()
}

export async function borrarProducto(id) {
  const res = await fetch(`${API}/productos/${id}`, {
    method: 'DELETE',
    headers: headersConPulsera(),
  })
  if (!res.ok) await errorDeRespuesta(res)
  return true
}
