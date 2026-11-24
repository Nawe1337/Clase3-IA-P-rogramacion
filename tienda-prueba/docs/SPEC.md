# 📝 SPEC — Tienda de zapatillas "Pisada" (Fase 2: backend + BD + login)

**Versión:** 2.0 · **Fase:** 2 de 2 (con API, base de datos y login por roles)
**Stack:** React + Vite + react-router (`:5173`) · API: Express + SQLite (`:3001`) · Tests: Vitest + Testing Library · Hash: `node:crypto` (scrypt + sal)

> 🔎 **Referencia:** la estructura se tomó de una tienda real de zapatillas: menú por
> género, filtros por deporte, orden por precio y descuento, cards con precio tachado,
> % OFF y cuotas. **Marcas, modelos, precios e imágenes son inventados** (no copiamos
> contenido ni marcas de nadie).

---

## 🎯 Objetivo

Que un cliente pueda **encontrar** zapatillas (buscar, filtrar, ordenar), **elegir su
talle** y **armar un carrito** con el total. Y que un **admin**, entrando por el mismo
login, pueda **modificar los productos de la base de datos** desde un panel (los clientes
ven los cambios al recargar: eso es el "tiempo real" de la clase).

## 🚪 La idea de la Fase 2: una puerta, dos mundos

- **El login** = la recepción: te pide el DNI (email + contraseña) y entrega la **pulsera** (token + rol).
- **El portero** = middleware `autenticar`: pide la pulsera en cada escritura.
- **La pulsera VIP** = middleware `soloAdmin`: solo `rol: "admin"` modifica productos.
- El catálogo (`GET /api/productos`) sigue **público**, como en cualquier e-commerce real.

## 🚫 Fuera de alcance (Fase 2)

- Registro de clientes (los usuarios se siembran), pagos reales, stock real, expiración de sesiones
- HTTPS (solo en producción) · JWT (mencionado como "next level", no se usa)

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

## 📦 Modelo de datos — Usuario y Sesión (nuevos, Fase 2)

**usuarios**

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | number | `1` |
| `email` | string (único) | `"admin@pisada.test"` |
| `password_hash` | string (`"sal:hash"` scrypt) | `"a1b2…:9f8e…"` |
| `rol` | `"cliente" \| "admin"` | `"admin"` |

**sesiones** (la pulsera guardada en la BD)

| Campo | Tipo | Ejemplo |
|---|---|---|
| `token` | string (único, `randomBytes`) | `"3f9c…"` |
| `usuario_id` | number | `1` |
| `creado_en` | texto (fecha) | `"2026-11-24 18:00"` |

> 🔒 La contraseña **nunca** se guarda ni viaja: se guarda su **hash** (`sal:hash`).
> Los usuarios semilla (demo, contraseñas de mentira): `admin@pisada.test / admin123`
> y `cliente@pisada.test / cliente123`.

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
- **CA-7.3** El front llama a la API de `VITE_API_URL` (fallback `http://localhost:3001/api`).

### R8 · Login (la puerta)
- **CA-8.1** Dado un usuario sembrado, cuando hago `POST /api/login` con email y contraseña correctos, entonces recibo `{ token, usuario: { email, rol } }`.
- **CA-8.2** Si el email o la contraseña son incorrectos, recibo **401** con un mensaje que no revela cuál falló.
- **CA-8.3** Las escrituras (`POST/PUT/DELETE /api/productos`) sin token → **401**; con token de rol `cliente` → **403**; el `GET /api/productos` sigue público.
- **CA-8.4** La contraseña se guarda como hash scrypt con sal (`"sal:hash"`); verificar = volver a hashear y comparar.
- **CA-8.5** En el front, tras el login se guarda `{ token, usuario }` en `localStorage`; al recargar sigo logueado.
- **CA-8.6** El logout borra la sesión de la BD (fila en `sesiones`) **y** del `localStorage`.
- **CA-8.7** La puerta tiene su propia URL: `/login` (el header linkea con "Ingresar"). Si ya estás logueado, te redirige a tu lugar (`/` o `/admin`).

### R9 · Panel admin (el depósito)
- **CA-9.1** Con sesión de rol `admin`, aparece un panel con la lista de productos (nombre y precio de la BD).
- **CA-9.2** Cuando edito el precio y guardo (`PUT`), entonces el catálogo muestra el precio nuevo al recargar.
- **CA-9.3** Puedo crear un producto (nombre + precio) y aparece en el catálogo.
- **CA-9.4** Puedo borrar un producto y desaparece del catálogo.
- **CA-9.5** Con rol `cliente` el panel no existe: la pulsera común no pasa.
- **CA-9.6** El depósito tiene su propia URL: `/admin`. Si entrás sin loguear (o sin ser admin), te manda a `/login`.

---

## 🏗️ Arquitectura (Fase 2: ya mudada)

```
tienda-prueba/
├── pisada.db                   ← SQLite (un archivo, se regenera con la semilla)
├── backend/                    ← la cocina (NUEVO)
│   ├── server.js               ← Express: la puerta, el catálogo y las escrituras protegidas
│   ├── db.js                   ← SQLite: tablas, semilla y consultas
│   ├── logic/sesiones.js       ← hash, token, rol, extraerToken (funciones puras + tests)
│   └── middleware/             ← autenticar (portero) · soloAdmin (pulsera VIP)
└── src/                        ← el mostrador (React + react-router: cada lugar tiene su URL)
    ├── paginas/Tienda.jsx      ← /       (el catálogo público)
    ├── paginas/PaginaLogin.jsx ← /login  (la puerta: entrás y caés a tu lugar)
    ├── paginas/PaginaAdmin.jsx ← /admin  (el depósito: SOLO pulseras VIP)
    ├── services/productosService.js ← ÚNICA puerta a la API (hace fetch con token)
    ├── services/sesionesService.js  ← login / logout / leer sesión (localStorage)
    ├── hooks/useSesion.js      ← estado de la sesión (vive en App: todos lo ven)
    ├── components/Login.jsx    ← el form de la puerta
    ├── components/PanelAdmin.jsx ← el depósito: editar, crear, borrar
    ├── logic/  hooks/  data/  components/  (todo lo de la Fase 1, igual)
    └── App.jsx                 ← el casco: header + rutas + carrito + guardia de /admin
```

**Regla clave (se mantiene):** los componentes nunca hablan con la API directo. Solo
los servicios hacen `fetch`. Con el login pasa lo mismo: el token lo maneja
`sesionesService`, los componentes solo dicen "entrá" y "salí".
