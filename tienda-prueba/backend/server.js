// ⚙️ La cocina: la API de Pisada (Express, puerto 3001).
// Levantala con:  npm run api     (y el front en otra terminal con: npm run dev)
//
// El mapa de la clase:
//   POST   /api/login             ← LA PUERTA (público): DNI + contraseña → pulsera (token)
//   DELETE /api/logout            ← devolver la pulsera (borra la sesión de la BD)
//   GET    /api/productos         ← el catálogo (público, como cualquier e-commerce)
//   POST/PUT/DELETE /api/productos ← EL DEPÓSITO: portero + pulsera VIP
import express from 'express'
import {
  obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto,
  buscarUsuarioPorEmail, crearSesion, borrarSesion,
} from './db.js'
import { verificarContrasenia } from './logic/sesiones.js'
import { autenticar } from './middleware/autenticar.js'
import { soloAdmin } from './middleware/soloAdmin.js'

const app = express()
app.use(express.json()) // para leer el JSON de los POST/PUT

// ── CORS a mano (sin instalar la librería cors) ─────────────
// El navegador bloquea pedidos entre puertos distintos (5173 → 3001).
// Le decimos que solo dejamos entrar a NUESTRO front:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_URL || 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204) // el navegador "tocó el timbre" antes de entrar
  next()
})

// ── LA PUERTA: el login (público) ───────────────────────────
app.post('/api/login', (req, res) => {
  const { email, contrasenia } = req.body || {}

  // 1. ¿existe el email?  2. ¿la contraseña coincide con el hash guardado?
  const usuario = buscarUsuarioPorEmail(email)
  if (!usuario || !verificarContrasenia(contrasenia ?? '', usuario.password_hash)) {
    // Mensaje genérico: no le decimos al atacante SI el email existe
    return res.status(401).json({ error: 'Email o contraseña incorrectos' })
  }

  // 3. Entrego la pulsera y la guardo como fila en la tabla sesiones
  const token = crearSesion(usuario.id)
  res.json({ token, usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol } })
})

// ── Devolver la pulsera: el logout (pedís con la pulsera puesta) ──
app.delete('/api/logout', autenticar, (req, res) => {
  borrarSesion(req.token) // borra la FILA en la BD, no solo el dato del navegador
  res.sendStatus(204)
})

// ── EL CATÁLOGO (público: el portero NO está acá) ───────────
app.get('/api/productos', (req, res) => {
  res.json(obtenerProductos())
})

app.get('/api/productos/:id', (req, res) => {
  const producto = obtenerProducto(req.params.id)
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(producto)
})

// ── EL DEPÓSITO: las escrituras, protegidas ─────────────────
const escrituras = express.Router()

// 🚨 ESTA ES LA LÍNEA DEL PORTERO 💂
// Comentala para la demo del gancho y cualquiera podrá cambiar TU base de datos.
escrituras.use(autenticar, soloAdmin)

escrituras.post('/productos', (req, res) => {
  const { nombre, precio } = req.body || {}
  if (!nombre || !String(nombre).trim()) return res.status(400).json({ error: 'Falta el nombre' })
  if (!Number.isFinite(Number(precio)) || Number(precio) <= 0) return res.status(400).json({ error: 'El precio tiene que ser un número mayor a 0' })
  res.status(201).json(crearProducto(req.body))
})

escrituras.put('/productos/:id', (req, res) => {
  const cambios = req.body || {}
  if (cambios.precio !== undefined && (!Number.isFinite(Number(cambios.precio)) || Number(cambios.precio) <= 0)) {
    return res.status(400).json({ error: 'El precio tiene que ser un número mayor a 0' })
  }
  const actualizado = actualizarProducto(req.params.id, cambios)
  if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(actualizado)
})

escrituras.delete('/productos/:id', (req, res) => {
  const ok = borrarProducto(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Producto no encontrado' })
  res.sendStatus(204)
})

app.use('/api', escrituras)

// ── Arranque ────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`⚙️  API de Pisada en http://localhost:${PORT}`)
  console.log('🔑 Usuarios semilla: admin@pisada.test / admin123 · cliente@pisada.test / cliente123')
})
