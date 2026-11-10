# 👟 tienda-prueba — Pisada

Tienda de zapatillas de ejemplo del curso **Programación con IA** (Día 5).

- **Fase 1 (actual):** solo frontend. Los productos están en `src/data/productos.js` y el carrito se guarda en `localStorage`.
- **Fase 2:** backend (Node + Express) + base de datos (SQLite). Solo cambia `src/services/productosService.js`.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173 (puerto en .env)
npm run test:run   # 30 tests
```

## Documentación

- [`docs/SPEC.md`](docs/SPEC.md): qué hace la tienda (requisitos R1-R7 y sus criterios)
- [`docs/MODELO_DE_TRABAJO.md`](docs/MODELO_DE_TRABAJO.md): cómo trabajamos (SDD + TDD)
- [`AGENTS.md`](AGENTS.md): reglas para el agente

> Marcas, modelos y precios son inventados. La estructura se tomó de una tienda real de zapatillas.
