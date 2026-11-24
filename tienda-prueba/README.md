# 👟 tienda-prueba — Pisada

Tienda de zapatillas de ejemplo del curso **Programación con IA** (Día 5 → Día 7).

- **Fase 1:** solo frontend (productos en `src/data/productos.js`, carrito en `localStorage`).
- **Fase 2 (actual):** backend (Node + Express) + SQLite + **login con roles** (Día 7).
  El catálogo lee de la API, el admin entra con `admin@pisada.test / admin123`
  y modifica la BD desde el panel. Cliente: `cliente@pisada.test / cliente123`.

## Arrancar (dos terminales)

```bash
npm install
npm run api        # terminal 1 → API en http://localhost:3001 (crea pisada.db y siembra)
npm run dev        # terminal 2 → tienda en http://localhost:5173 (puerto en .env)
npm run test:run   # 50 tests (Fase 1 + lógica de sesiones + login/panel/rutas)
```

> URLs: `/` la tienda (pública) · `/login` la puerta · `/admin` el depósito (solo admin).
> Si se rompe la base de datos: borrá `pisada.db` y reiniciá `npm run api` — se siembra solo.

## Documentación

- [`docs/SPEC.md`](docs/SPEC.md): qué hace la tienda (requisitos R1-R7 + **R8 Login** y **R9 Panel admin**)
- [`docs/MODELO_DE_TRABAJO.md`](docs/MODELO_DE_TRABAJO.md): cómo trabajamos (SDD + TDD)
- [`AGENTS.md`](AGENTS.md): reglas para el agente

> Marcas, modelos y precios son inventados. La estructura se tomó de una tienda real de zapatillas.
