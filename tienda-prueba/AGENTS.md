# AGENTS.md — tienda-prueba

## Sobre este proyecto
- Tienda de zapatillas "Pisada" en React + Vite. Proyecto de ejemplo del curso.
- Fase 1: solo frontend (datos locales). Fase 2: backend + base de datos.

## Cómo quiero que trabajes (SDD + TDD)
- Leé `docs/SPEC.md` antes de cualquier cambio. Si lo que pido no está en la spec, proponé primero el cambio a la spec.
- Una tarea por pedido: un requisito (R) o un criterio (CA) por vez.
- TDD: primero el test (rojo), después el código mínimo (verde), después refactor.
- La lógica de negocio va en `src/logic/` como funciones puras. Los componentes no leen `src/data/` directo: usan `src/services/`.
- Antes de terminar, corré `npm run test:run` y mostrame que está en verde.

## Reglas
- No instales librerías sin preguntarme.
- Nunca escribas claves o secretos en el código: van en `.env` (que no se sube).
- Explicame cada cambio en pocas líneas, como para principiante.

## Comandos
- `npm install` → instala dependencias
- `npm run dev` → http://localhost:5173 (puerto en `.env`)
- `npm test` → tests en modo watch · `npm run test:run` → una vez
