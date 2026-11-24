// 🔐 La lógica de las sesiones — funciones PURAS (TDD: ver sesiones.test.js).
// Cero librerías nuevas: todo con node:crypto, que ya viene con Node.
import crypto from 'node:crypto'

// La huella: hash scrypt con sal. La sal se genera acá y se guarda PEGADA al hash
// ("sal:hash"), así no necesitamos una columna aparte.
// scrypt es lento a propósito: eso dificulta adivinar contraseñas por fuerza bruta.
export function hashContrasenia(contrasenia, sal = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(String(contrasenia), sal, 64).toString('hex')
  return `${sal}:${hash}`
}

// La verificación NO decodifica nada (el hash es de una sola vía):
// vuelve a hashear con la MISMA sal y compara si da exactamente igual.
// (En producción se compara con timingSafeEqual para evitar ataques de tiempo.)
export function verificarContrasenia(contrasenia, guardado) {
  if (typeof guardado !== 'string' || !guardado.includes(':')) return false
  const [sal] = guardado.split(':')
  return hashContrasenia(contrasenia, sal) === guardado
}

// La pulsera: un string aleatorio imposible de adivinar.
export function generarToken() {
  return crypto.randomBytes(24).toString('hex')
}

// El color de la pulsera: solo el rol "admin" entra al depósito.
export function esAdmin(usuario) {
  return Boolean(usuario && usuario.rol === 'admin')
}

// Lee el header "Authorization: Bearer <token>" y devuelve el token pelado.
// Tolerante: acepta con o sin el prefijo "Bearer".
export function extraerToken(header) {
  if (typeof header !== 'string') return null
  const token = header.replace(/^Bearer\s+/i, '').trim()
  return token || null
}
