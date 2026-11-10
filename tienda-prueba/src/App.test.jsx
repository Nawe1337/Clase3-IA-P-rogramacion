// Tests de integración: probamos la tienda como la usaría una persona.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

async function abrirTienda() {
  const user = userEvent.setup()
  const vista = render(<App />)
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
