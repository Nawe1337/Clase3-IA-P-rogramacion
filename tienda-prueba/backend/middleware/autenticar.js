// 🕴️ EL PORTERO — middleware de autenticación.
// Se para ANTES de las rutas de escritura y pide la pulsera (token).
// Si la pulsera es válida, engancha el usuario en req.usuario y deja pasar.
// Si no → 401 (no sé quién sos).
import { extraerToken } from '../logic/sesiones.js'
import { leerSesion } from '../db.js'

export function autenticar(req, res, next) {
  const token = extraerToken(req.headers.authorization)
  const sesion = token ? leerSesion(token) : null

  if (!sesion) {
    return res.status(401).json({ error: 'Falta la pulsera o no es válida (401). Hacé login primero.' })
  }

  req.token = sesion.token // el logout la necesita para borrarla de la BD
  req.usuario = sesion.usuario // { id, email, rol }
  next()
}
