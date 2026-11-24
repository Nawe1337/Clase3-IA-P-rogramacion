// 💎 LA PULSERA VIP — middleware de autorización.
// Va SIEMPRE DESPUÉS del portero (necesita req.usuario, que él dejó).
// Solo el rol "admin" entra al depósito; el cliente recibe 403 (te conozco, pero no pasás).
import { esAdmin } from '../logic/sesiones.js'

export function soloAdmin(req, res, next) {
  if (!esAdmin(req.usuario)) {
    return res.status(403).json({ error: 'Tu pulsera no pasa acá: solo el admin modifica productos (403).' })
  }
  next()
}
