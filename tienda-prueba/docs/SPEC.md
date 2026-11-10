# 📝 SPEC — Tienda de zapatillas "Pisada" (Fase 1: solo frontend)

**Versión:** 1.0 · **Fase:** 1 de 2 (sin backend, sin base de datos)
**Stack:** React + Vite · Tests: Vitest + Testing Library · Puerto: `5173` (en `.env`)

> 🔎 **Referencia:** la estructura se tomó de una tienda real de zapatillas: menú por
> género, filtros por deporte, orden por precio y descuento, cards con precio tachado,
> % OFF y cuotas. **Marcas, modelos, precios e imágenes son inventados** (no copiamos
> contenido ni marcas de nadie).

---

## 🎯 Objetivo

Que un cliente pueda **encontrar** zapatillas (buscar, filtrar, ordenar), **elegir su
talle** y **armar un carrito** con el total, todo en el navegador.

## 🚫 Fuera de alcance (Fase 1)

- Backend, API y base de datos → **Fase 2** (clase 5)
- Login, pagos reales, stock real

---

## 📦 Modelo de datos — Producto

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | number | `1` |
| `nombre` | string | `"Velox Ráfaga 3"` |
| `marca` | string | `"Velox"` |
| `genero` | `"hombre" \| "mujer" \| "unisex"` | `"mujer"` |
| `deporte` | `"running" \| "training" \| "urbana" \| "basquet" \| "trail"` | `"running"` |
| `precio` | number (ARS, precio final) | `89999` |
| `precioAnterior` | number \| null | `129999` |
| `cuotas` | number | `3` |
| `talles` | number[] | `[36, 37, 38, 39]` |
| `color` | string (hex, para el dibujo) | `"#ff5a36"` |
| `nuevo` | boolean | `true` |

---

## ✅ Requisitos y criterios de aceptación

### R1 · Catálogo
- **CA-1.1** Dado el catálogo, cuando abro la tienda, entonces veo una card por producto (mínimo 12).
- **CA-1.2** Cada card muestra nombre, marca, precio en formato `$ 89.999` y las cuotas sin interés.
- **CA-1.3** Si el producto tiene `precioAnterior`, la card muestra el precio tachado y el badge `-X% OFF`.
- **CA-1.4** Si el producto es `nuevo`, la card muestra el badge `NUEVO`.

### R2 · Buscador
- **CA-2.1** Cuando escribo un texto, solo veo productos cuyo **nombre o marca** lo contienen.
- **CA-2.2** La búsqueda ignora mayúsculas y acentos (`"rafaga"` encuentra `"Ráfaga"`).
- **CA-2.3** Con el texto vacío, veo todos los productos.

### R3 · Filtros
- **CA-3.1** Puedo filtrar por **género** (Todos / Hombre / Mujer); los `unisex` aparecen en Hombre y en Mujer.
- **CA-3.2** Puedo filtrar por **deporte** (Todos / Running / Training / Urbana / Básquet / Trail).
- **CA-3.3** Los filtros y el buscador se combinan.
- **CA-3.4** Si no hay resultados, veo el mensaje "No encontramos zapatillas con esos filtros".

### R4 · Orden
- **CA-4.1** Puedo ordenar por: Relevancia (orden original), Menor precio, Mayor precio, Mejor descuento.
- **CA-4.2** Ordenar no modifica la lista original.

### R5 · Talle
- **CA-5.1** Cada card muestra sus talles disponibles; tengo que elegir uno para agregar.
- **CA-5.2** Sin talle elegido, el botón "Agregar" está deshabilitado.

### R6 · Carrito
- **CA-6.1** Al agregar, el contador 🛒 del header suma 1.
- **CA-6.2** Mismo producto + mismo talle → suma cantidad (no duplica la línea). Otro talle → línea nueva.
- **CA-6.3** En el panel puedo sumar (+), restar (−) y quitar; si la cantidad llega a 0, la línea se quita.
- **CA-6.4** El panel muestra el total en `$` y un botón "Vaciar".
- **CA-6.5** El carrito sobrevive al recargar la página (`localStorage`).

### R7 · Configuración por `.env`
- **CA-7.1** El servidor de desarrollo usa `VITE_PORT` (fallback `5173`).
- **CA-7.2** El nombre de la tienda en el header sale de `VITE_NOMBRE_TIENDA`.

---

## 🏗️ Arquitectura (pensada para la Fase 2)

```
src/
├── data/productos.js           ← los datos (HOY). En Fase 2 → base de datos
├── services/productosService.js← ÚNICO lugar que sabe de dónde vienen los datos
├── logic/                      ← funciones puras, testeadas (TDD)
│   ├── formato.js              ← formatearPrecio, porcentajeDescuento
│   ├── filtros.js              ← filtrarProductos, ordenarProductos
│   └── carrito.js              ← agregar, cambiarCantidad, quitar, total, cantidadTotal
├── hooks/useCarrito.js         ← estado del carrito + localStorage
└── components/                 ← la vista (Header, Filtros, ProductCard, Carrito…)
```

**Regla clave:** los componentes nunca importan `data/` directamente. Siempre pasan por
`productosService`. En la Fase 2 solo cambia ese archivo:

```js
// Fase 1 (hoy)
return Promise.resolve(productos)

// Fase 2 (backend)
const res = await fetch(`${import.meta.env.VITE_API_URL}/productos`)
return res.json()
```
