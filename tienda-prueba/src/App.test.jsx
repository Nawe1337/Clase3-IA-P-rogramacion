// Tests de integración: probamos la tienda como la usaría una persona.
// La API está SIMULADA: reemplazamos el fetch global con una mini-API que se
// comporta como backend/server.js (login, 401 sin pulsera, 403 para clientes…).
// Así probamos el camino completo (componente → servicio → fetch → JSON) sin backend.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { productos } from './data/productos.js'

const USUARIOS = [
  { id: 1, email: 'admin@pisada.test', rol: 'admin', contrasenia: 'admin123' },
  { id: 2, email: 'cliente@pisada.test', rol: 'cliente', contrasenia: 'cliente123' },
]

function crearApiDePrueba() {
  let catalogo = structuredClone(productos) // mutable: los PUT de verdad lo cambian
  const pulseras = new Map() // token → usuario (la tabla sesiones de mentira)

  return vi.fn(async (url, opciones = {}) => {
    const metodo = (opciones.method || 'GET').toUpperCase()
    const ruta = new URL(url).pathname
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : {}
    const responder = (estado, datos = {}) => ({ ok: estado < 400, status: estado, json: async () => datos })

    if (metodo === 'GET' && ruta === '/api/productos') {
      // Copia: la API real devuelve un objeto NUEVO en cada respuesta (React lo necesita para detectar cambios)
      return responder(200, structuredClone(catalogo))
    }

    if (metodo === 'POST' && ruta === '/api/login') {
      const u = USUARIOS.find((x) => x.email === cuerpo.email && x.contrasenia === cuerpo.contrasenia)
      if (!u) return responder(401, { error: 'Email o contraseña incorrectos' })
      const token = `pulsera-${u.id}`
      pulseras.set(token, u)
      return responder(200, { token, usuario: { id: u.id, email: u.email, rol: u.rol } })
    }

    const dueno = () => pulseras.get((opciones.headers?.Authorization || '').replace('Bearer ', ''))

    if (metodo === 'PUT' && /^\/api\/productos\/\d+$/.test(ruta)) {
      const usuario = dueno()
      if (!usuario) return responder(401, { error: 'Falta la pulsera o no es válida (401)' })
      if (usuario.rol !== 'admin') return responder(403, { error: 'Tu pulsera no pasa acá (403)' })
      const id = Number(ruta.split('/').pop())
      const i = catalogo.findIndex((p) => p.id === id)
      if (i === -1) return responder(404, { error: 'Producto no encontrado' })
      catalogo[i] = { ...catalogo[i], ...cuerpo }
      return responder(200, { ...catalogo[i] })
    }

    if (metodo === 'POST' && ruta === '/api/productos') {
      const usuario = dueno()
      if (!usuario) return responder(401, { error: 'Falta la pulsera o no es válida (401)' })
      if (usuario.rol !== 'admin') return responder(403, { error: 'Tu pulsera no pasa acá (403)' })
      const id = Math.max(0, ...catalogo.map((p) => p.id)) + 1
      const nuevo = {
        id, marca: 'Pisada', genero: 'unisex', deporte: 'urbana', precioAnterior: null,
        cuotas: 3, talles: [38, 39, 40, 41, 42], color: '#111827', nuevo: true, ...cuerpo,
      }
      catalogo.push(nuevo)
      return responder(201, { ...nuevo })
    }

    if (metodo === 'DELETE' && /^\/api\/productos\/\d+$/.test(ruta)) {
      const usuario = dueno()
      if (!usuario) return responder(401, { error: 'Falta la pulsera o no es válida (401)' })
      if (usuario.rol !== 'admin') return responder(403, { error: 'Tu pulsera no pasa acá (403)' })
      const id = Number(ruta.split('/').pop())
      catalogo = catalogo.filter((p) => p.id !== id)
      return responder(204)
    }

    if (metodo === 'DELETE' && ruta === '/api/logout') {
      pulseras.delete((opciones.headers?.Authorization || '').replace('Bearer ', ''))
      return responder(204)
    }

    return responder(404, { error: `Ruta no simulada: ${metodo} ${ruta}` })
  })
}

beforeEach(() => {
  vi.stubGlobal('fetch', crearApiDePrueba())
})

async function abrirTienda() {
  const user = userEvent.setup()
  const vista = render(
    // MemoryRouter: el router de mentira para los tests (arrancamos en la URL que queremos)
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  await screen.findAllByRole('article') // esperamos a que el servicio devuelva los productos
  return { user, ...vista }
}

describe('Tienda Pisada (integración)', () => {
  it('CA-1.1 muestra al menos 12 productos', async () => {
    await abrirTienda()
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(12)
  })

  it('CA-1.3 muestra precio tachado y % OFF', async () => {
    await abrirTienda()
    const card = screen.getByRole('article', { name: 'Velox Nube Max Mujer' })
    expect(within(card).getByText('-60% OFF')).toBeInTheDocument()
    expect(within(card).getByText('$ 309.999')).toBeInTheDocument()
  })

  it('CA-2.1 el buscador filtra mientras escribo', async () => {
    const { user } = await abrirTienda()
    await user.type(screen.getByRole('searchbox', { name: 'Buscar zapatillas' }), 'andes')
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(2)
  })

  it('CA-3.4 sin resultados muestra el mensaje', async () => {
    const { user } = await abrirTienda()
    await user.type(screen.getByRole('searchbox'), 'xyz-no-existe')
    expect(screen.getByText('No encontramos zapatillas con esos filtros')).toBeInTheDocument()
  })

  it('CA-3.2 filtra por deporte', async () => {
    const { user } = await abrirTienda()
    const deporte = screen.getByRole('group', { name: 'Deporte' })
    await user.click(within(deporte).getByRole('button', { name: 'Trail' }))
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('CA-5.2 + CA-6.1 elegir talle habilita agregar y suma al contador', async () => {
    const { user } = await abrirTienda()
    const card = screen.getByRole('article', { name: 'Andes Cumbre GTX Unisex' })
    const agregar = within(card).getByRole('button', { name: 'Agregar Andes Cumbre GTX Unisex' })

    expect(agregar).toBeDisabled()
    await user.click(within(card).getByRole('button', { name: '40' }))
    expect(agregar).toBeEnabled()

    await user.click(agregar)
    await user.click(agregar)
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('2')
    expect(screen.getByTestId('cantidad-3-40')).toHaveTextContent('2')
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$ 309.998')
  })

  it('CA-6.4 vaciar deja el carrito en cero', async () => {
    const { user } = await abrirTienda()
    const card = screen.getByRole('article', { name: 'Urbano Clásica Low Unisex' })
    await user.click(within(card).getByRole('button', { name: '38' }))
    await user.click(within(card).getByRole('button', { name: /Agregar/ }))
    await user.click(screen.getByRole('button', { name: 'Vaciar' }))
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('0')
  })

  it('CA-6.5 el carrito sobrevive al recargar', async () => {
    const { user, unmount } = await abrirTienda()
    const card = screen.getByRole('article', { name: 'Urbano Clásica Low Unisex' })
    await user.click(within(card).getByRole('button', { name: '38' }))
    await user.click(within(card).getByRole('button', { name: /Agregar/ }))
    unmount() // "cerramos la pestaña"

    await abrirTienda() // "volvemos a entrar"
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
  })
})

describe('Login y panel admin (R8 · R9)', () => {
  async function entrar(user, email, contrasenia) {
    await user.click(screen.getByRole('link', { name: 'Ingresar' })) // vamos a la puerta (/login)
    await user.type(screen.getByLabelText('Email'), email)
    await user.type(screen.getByLabelText('Contraseña'), contrasenia)
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
  }

  it('CA-8.2 contraseña mal → mensaje de error y sin panel', async () => {
    const { user } = await abrirTienda()
    await entrar(user, 'admin@pisada.test', 'incorrecta')
    expect(await screen.findByRole('alert')).toHaveTextContent('Email o contraseña incorrectos')
    expect(screen.queryByRole('heading', { name: /panel admin/i })).not.toBeInTheDocument()
  })

  it('CA-8.1 + CA-9.1 login admin → aparece el panel con los productos de la BD', async () => {
    const { user } = await abrirTienda()
    await entrar(user, 'admin@pisada.test', 'admin123')
    expect(await screen.findByRole('heading', { name: /panel admin/i })).toBeInTheDocument()
    expect(screen.getAllByTestId('panel-fila')).toHaveLength(14)
  })

  it('CA-9.5 login cliente → saludo, pero SIN panel (la pulsera común no pasa)', async () => {
    const { user } = await abrirTienda()
    await entrar(user, 'cliente@pisada.test', 'cliente123')
    expect(await screen.findByText('cliente@pisada.test')).toBeInTheDocument()
    expect(screen.getByText('cliente')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /panel admin/i })).not.toBeInTheDocument()
  })

  it('CA-9.2 el admin cambia un precio → el catálogo lo muestra al toque', async () => {
    const { user } = await abrirTienda()
    await entrar(user, 'admin@pisada.test', 'admin123')
    const fila = (await screen.findAllByTestId('panel-fila'))[0]
    const precio = within(fila).getByLabelText('Precio')
    await user.clear(precio)
    await user.type(precio, '77777')
    await user.click(within(fila).getByRole('button', { name: 'Guardar' }))
    await user.click(screen.getByRole('link', { name: /volver a la tienda/i })) // volvemos al catálogo
    expect(await screen.findByText('$ 77.777')).toBeInTheDocument()
  })

  it('CA-9.3 el admin crea un producto → aparece en el catálogo', async () => {
    const { user } = await abrirTienda()
    await entrar(user, 'admin@pisada.test', 'admin123')
    await screen.findByRole('heading', { name: /panel admin/i })
    await user.type(screen.getByLabelText('Nombre del nuevo producto'), 'Zapa Test 3000')
    await user.type(screen.getByLabelText('Precio del nuevo producto'), '65999')
    await user.click(screen.getByRole('button', { name: 'Crear' }))
    await user.click(screen.getByRole('link', { name: /volver a la tienda/i })) // volvemos al catálogo
    expect(await screen.findByRole('article', { name: /Zapa Test 3000/ })).toBeInTheDocument()
  })

  it('CA-8.6 logout → vuelve el link de Ingresar', async () => {
    const { user } = await abrirTienda()
    await entrar(user, 'cliente@pisada.test', 'cliente123')
    await user.click(await screen.findByRole('button', { name: 'Salir' }))
    expect(await screen.findByRole('link', { name: 'Ingresar' })).toBeInTheDocument()
  })

  it('CA-9.6 /admin sin ser admin → te manda a la puerta', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>,
    )
    // sin sesión: el guardia redirige a /login y aparece el form
    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /panel admin/i })).not.toBeInTheDocument()
  })
})
