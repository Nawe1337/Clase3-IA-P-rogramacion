// 🔐 La puerta del FRONT: login, logout y guardar la pulsera.
// Es un servicio: los componentes nunca tocan fetch ni localStorage directamente.
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const CLAVE = 'sesion-pisada'

// El login: manda el DNI (email + contraseña) y guarda lo que devuelve
// (la pulsera + quién sos). La contraseña NUNCA se guarda: solo viaja en este pedido.
export async function login(email, contrasenia) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, contrasenia }),
  })
  if (!res.ok) throw new Error('Email o contraseña incorrectos')
  const datos = await res.json()
  localStorage.setItem(CLAVE, JSON.stringify(datos)) // { token, usuario }
  return datos
}

// El logout tiene DOS partes: avisarle a la BD que destruya la pulsera
// (borra la fila en la tabla sesiones) y borrarla del navegador.
// Si la primera falla (sin red), igual limpiamos el navegador.
export async function logout() {
  const sesion = leerSesion()
  if (sesion?.token) {
    await fetch(`${API}/logout`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sesion.token}` },
    }).catch(() => {})
  }
  localStorage.removeItem(CLAVE)
}

// ¿Hay alguien logueado? (para que al recargar siga logueado)
export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || null
  } catch {
    return null
  }
}
