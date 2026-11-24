// 🗄️ La heladera: SQLite con el módulo que YA VIENE en Node (node:sqlite).
// Cero instalaciones: la base de datos es UN archivo (pisada.db) en la raíz del proyecto.
// Si el archivo no existe (o las tablas están vacías), se siembra solo → la demo nunca se rompe.
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { productos } from '../src/data/productos.js'
import { hashContrasenia, generarToken } from './logic/sesiones.js'

// pisada.db vive en la RAÍZ del proyecto (al lado de package.json), no dentro de backend/
const RUTA_DB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'pisada.db')

export const db = new DatabaseSync(RUTA_DB)

// ── Las tablas ──────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id              INTEGER PRIMARY KEY,
    nombre          TEXT NOT NULL,
    marca           TEXT NOT NULL,
    genero          TEXT NOT NULL,
    deporte         TEXT NOT NULL,
    precio          INTEGER NOT NULL,
    precio_anterior INTEGER,
    cuotas          INTEGER,
    talles          TEXT,   -- array de talles guardado como JSON
    color           TEXT,
    nuevo           INTEGER -- 0 o 1 (SQLite no tiene booleano)
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,   -- "sal:hash" — NUNCA la contraseña en claro
    rol           TEXT NOT NULL DEFAULT 'cliente'
  );

  CREATE TABLE IF NOT EXISTS sesiones (
    token      TEXT PRIMARY KEY,   -- la pulsera
    usuario_id INTEGER NOT NULL,
    creado_en  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

// ── La semilla (solo si las tablas están vacías) ────────────
const { n: cantidadProductos } = db.prepare('SELECT COUNT(*) AS n FROM productos').get()
if (cantidadProductos === 0) {
  const insertar = db.prepare(
    'INSERT INTO productos (id, nombre, marca, genero, deporte, precio, precio_anterior, cuotas, talles, color, nuevo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  )
  for (const p of productos) {
    insertar.run(p.id, p.nombre, p.marca, p.genero, p.deporte, p.precio, p.precioAnterior, p.cuotas, JSON.stringify(p.talles), p.color, p.nuevo ? 1 : 0)
  }
  console.log(`🌱 Sembré ${productos.length} productos en pisada.db`)
}

const { n: cantidadUsuarios } = db.prepare('SELECT COUNT(*) AS n FROM usuarios').get()
if (cantidadUsuarios === 0) {
  const insertarUsuario = db.prepare('INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, ?)')
  // ⚠️ Credenciales de DEMO para la clase — nunca uses contraseñas reales acá
  insertarUsuario.run('admin@pisada.test', hashContrasenia('admin123'), 'admin')
  insertarUsuario.run('cliente@pisada.test', hashContrasenia('cliente123'), 'cliente')
  console.log('🌱 Sembré 2 usuarios: admin@pisada.test / admin123 y cliente@pisada.test / cliente123')
}

// ── El traductor: fila de SQLite → producto que entiende el front ──
function filaAProducto(f) {
  return {
    id: f.id,
    nombre: f.nombre,
    marca: f.marca,
    genero: f.genero,
    deporte: f.deporte,
    precio: f.precio,
    precioAnterior: f.precio_anterior,
    cuotas: f.cuotas,
    talles: JSON.parse(f.talles),
    color: f.color,
    nuevo: Boolean(f.nuevo),
  }
}

// ── Productos: consultas (el catálogo es público) ───────────
export function obtenerProductos() {
  return db.prepare('SELECT * FROM productos ORDER BY id').all().map(filaAProducto)
}

export function obtenerProducto(id) {
  const fila = db.prepare('SELECT * FROM productos WHERE id = ?').get(Number(id))
  return fila ? filaAProducto(fila) : null
}

export function crearProducto(datos) {
  const maxId = db.prepare('SELECT MAX(id) AS m FROM productos').get().m || 0
  const fila = {
    id: maxId + 1,
    nombre: String(datos.nombre ?? '').trim(),
    marca: String(datos.marca ?? 'Pisada'),
    genero: String(datos.genero ?? 'unisex'),
    deporte: String(datos.deporte ?? 'urbana'),
    precio: Number(datos.precio),
    precio_anterior: datos.precioAnterior ?? null,
    cuotas: Number(datos.cuotas ?? 3),
    talles: JSON.stringify(datos.talles ?? [38, 39, 40, 41, 42]),
    color: datos.color ?? '#111827',
    nuevo: datos.nuevo === false ? 0 : 1,
  }
  db.prepare(
    'INSERT INTO productos (id, nombre, marca, genero, deporte, precio, precio_anterior, cuotas, talles, color, nuevo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  ).run(fila.id, fila.nombre, fila.marca, fila.genero, fila.deporte, fila.precio, fila.precio_anterior, fila.cuotas, fila.talles, fila.color, fila.nuevo)
  return obtenerProducto(fila.id)
}

const CAMPOS = {
  nombre: 'nombre', marca: 'marca', genero: 'genero', deporte: 'deporte',
  precio: 'precio', precioAnterior: 'precio_anterior', cuotas: 'cuotas', color: 'color', nuevo: 'nuevo',
}

export function actualizarProducto(id, cambios) {
  const actual = obtenerProducto(id)
  if (!actual) return null
  const siguiente = { ...actual, ...cambios } // solo pisa los campos que mandaron
  db.prepare(
    'UPDATE productos SET nombre=?, marca=?, genero=?, deporte=?, precio=?, precio_anterior=?, cuotas=?, talles=?, color=?, nuevo=? WHERE id=?',
  ).run(
    siguiente.nombre, siguiente.marca, siguiente.genero, siguiente.deporte, siguiente.precio,
    siguiente.precioAnterior, siguiente.cuotas, JSON.stringify(siguiente.talles), siguiente.color,
    siguiente.nuevo ? 1 : 0, Number(id),
  )
  return obtenerProducto(id)
}

export function borrarProducto(id) {
  const info = db.prepare('DELETE FROM productos WHERE id = ?').run(Number(id))
  return info.changes > 0
}

// ── Usuarios y sesiones (la puerta y la pulsera) ────────────
export function buscarUsuarioPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(String(email ?? '').toLowerCase().trim())
}

export function crearSesion(usuarioId) {
  const token = generarToken()
  db.prepare('INSERT INTO sesiones (token, usuario_id) VALUES (?, ?)').run(token, usuarioId)
  return token
}

// El portero usa esto: dado un token, ¿qué usuario es? (o null si la pulsera no existe)
export function leerSesion(token) {
  const fila = db
    .prepare(
      `SELECT s.token, u.id, u.email, u.rol
       FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id
       WHERE s.token = ?`,
    )
    .get(String(token ?? ''))
  if (!fila) return null
  return { token: fila.token, usuario: { id: fila.id, email: fila.email, rol: fila.rol } }
}

export function borrarSesion(token) {
  db.prepare('DELETE FROM sesiones WHERE token = ?').run(String(token ?? ''))
}
