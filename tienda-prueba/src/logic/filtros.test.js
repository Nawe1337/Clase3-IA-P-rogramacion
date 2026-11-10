import { describe, it, expect } from 'vitest'
import { filtrarProductos, ordenarProductos } from './filtros.js'

const lista = [
  { id: 1, nombre: 'Velox Ráfaga 3', marca: 'Velox', genero: 'mujer',  deporte: 'running', precio: 300, precioAnterior: 400 },
  { id: 2, nombre: 'Andes Cumbre',   marca: 'Andes', genero: 'unisex', deporte: 'trail',   precio: 100, precioAnterior: null },
  { id: 3, nombre: 'Aro Volcada',    marca: 'Aro',   genero: 'hombre', deporte: 'basquet', precio: 200, precioAnterior: 1000 },
]
const ids = (arr) => arr.map((p) => p.id)

describe('filtrarProductos — buscador (R2)', () => {
  it('CA-2.1 busca por nombre o marca', () => {
    expect(ids(filtrarProductos(lista, { texto: 'volcada' }))).toEqual([3])
    expect(ids(filtrarProductos(lista, { texto: 'andes' }))).toEqual([2])
  })
  it('CA-2.2 ignora mayúsculas y acentos', () => {
    expect(ids(filtrarProductos(lista, { texto: 'RAFAGA' }))).toEqual([1])
  })
  it('CA-2.3 texto vacío devuelve todos', () => {
    expect(ids(filtrarProductos(lista, { texto: '' }))).toEqual([1, 2, 3])
    expect(ids(filtrarProductos(lista, {}))).toEqual([1, 2, 3])
  })
})

describe('filtrarProductos — filtros (R3)', () => {
  it('CA-3.1 género incluye unisex', () => {
    expect(ids(filtrarProductos(lista, { genero: 'mujer' }))).toEqual([1, 2])
    expect(ids(filtrarProductos(lista, { genero: 'hombre' }))).toEqual([2, 3])
  })
  it('CA-3.2 filtra por deporte', () => {
    expect(ids(filtrarProductos(lista, { deporte: 'trail' }))).toEqual([2])
  })
  it('CA-3.3 combina buscador + filtros', () => {
    expect(ids(filtrarProductos(lista, { texto: 'a', genero: 'hombre', deporte: 'basquet' }))).toEqual([3])
    expect(filtrarProductos(lista, { texto: 'velox', genero: 'hombre' })).toEqual([])
  })
  it('"todos" no filtra', () => {
    expect(filtrarProductos(lista, { genero: 'todos', deporte: 'todos' })).toHaveLength(3)
  })
})

describe('ordenarProductos (R4)', () => {
  it('CA-4.1 menor y mayor precio', () => {
    expect(ids(ordenarProductos(lista, 'menor-precio'))).toEqual([2, 3, 1])
    expect(ids(ordenarProductos(lista, 'mayor-precio'))).toEqual([1, 3, 2])
  })
  it('CA-4.1 mejor descuento primero', () => {
    expect(ids(ordenarProductos(lista, 'descuento'))).toEqual([3, 1, 2])
  })
  it('CA-4.1 relevancia mantiene el orden original', () => {
    expect(ids(ordenarProductos(lista, 'relevancia'))).toEqual([1, 2, 3])
  })
  it('CA-4.2 no modifica la lista original', () => {
    ordenarProductos(lista, 'menor-precio')
    expect(ids(lista)).toEqual([1, 2, 3])
  })
})
