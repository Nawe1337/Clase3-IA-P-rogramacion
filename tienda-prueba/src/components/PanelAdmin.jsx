// 🛠️ EL DEPÓSITO — el panel del admin.
// Todo lo que guardás acá va directo a la BASE DE DATOS (PUT/POST/DELETE a la API,
// que solo acepta pulseras VIP). El catálogo de los clientes se actualiza al recargar.
import { useState } from 'react'
import { actualizarProducto, crearProducto, borrarProducto } from '../services/productosService.js'

export default function PanelAdmin({ productos, onCambio }) {
  const [precios, setPrecios] = useState({}) // lo que se está tipeando: { id: '77777' }
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '' })
  const [mensaje, setMensaje] = useState('')

  // Envuelve cada acción: si el portero rechaza (401/403), mostramos SU mensaje.
  // Si sale bien → onCambio() re-carga el catálogo desde la API.
  async function conFeedback(accion) {
    setMensaje('')
    try {
      await accion()
      await onCambio()
    } catch (err) {
      setMensaje(err.message)
    }
  }

  const guardarPrecio = (producto) =>
    conFeedback(() => actualizarProducto(producto.id, { precio: Number(precios[producto.id]) }))

  const borrar = (producto) => conFeedback(() => borrarProducto(producto.id))

  const crear = async (evento) => {
    evento.preventDefault()
    setMensaje('')
    try {
      await crearProducto({ nombre: nuevo.nombre, precio: Number(nuevo.precio) })
      setNuevo({ nombre: '', precio: '' })
      await onCambio()
    } catch (err) {
      setMensaje(err.message)
    }
  }

  return (
    <section className="panel" aria-label="Panel admin">
      <h2 className="panel__titulo">Panel admin — el depósito</h2>
      <p className="panel__bajada">
        Todo lo que guardás acá va directo a la base de datos. Los clientes lo ven al recargar.
      </p>

      {mensaje && (
        <p className="panel__mensaje" role="status">
          {mensaje}
        </p>
      )}

      <form className="panel__nuevo" onSubmit={crear}>
        <input
          aria-label="Nombre del nuevo producto"
          placeholder="Nombre del producto"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          required
        />
        <input
          aria-label="Precio del nuevo producto"
          type="number"
          min="1"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
          required
        />
        <button type="submit">Crear</button>
      </form>

      <ul className="panel__lista">
        {productos.map((producto) => (
          <li key={producto.id} className="panel__fila" data-testid="panel-fila">
            <span className="panel__nombre">
              {producto.nombre} <span className="muted">· {producto.marca}</span>
            </span>
            <label>
              Precio
              <input
                type="number"
                min="1"
                value={precios[producto.id] ?? producto.precio}
                onChange={(e) => setPrecios({ ...precios, [producto.id]: e.target.value })}
              />
            </label>
            <button onClick={() => guardarPrecio(producto)}>Guardar</button>
            <button className="panel__borrar" onClick={() => borrar(producto)}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
