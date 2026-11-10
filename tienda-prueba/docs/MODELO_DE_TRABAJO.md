# 🧭 Modelo de trabajo: SDD + TDD

> Así trabajamos en el curso con el agente. Este archivo vive en el proyecto para que
> **vos y el agente** sigan las mismas reglas.

---

## 1. SDD — Spec-Driven Development (primero la especificación)

**Idea:** antes de pedirle código al agente, escribimos **qué** queremos y **cómo
sabemos que está bien**. La spec es el contrato: el agente la lee, nosotros la revisamos.

```
📝 SPEC  →  ✅ Criterios de aceptación  →  🧪 Tests  →  💻 Código  →  🔍 Revisión
```

Una buena spec tiene:

| Parte | Pregunta que responde | Ejemplo |
|---|---|---|
| **Objetivo** | ¿Para qué existe esto? | "El cliente encuentra zapatillas por nombre" |
| **Requisitos** | ¿Qué tiene que hacer? (numerados: R1, R2…) | "R2 · El buscador filtra por nombre y marca" |
| **Criterios de aceptación** | ¿Cómo sé que funciona? (Dado / Cuando / Entonces) | "Dado el catálogo, cuando escribo 'trail', entonces veo solo las de trail" |
| **Fuera de alcance** | ¿Qué NO hacemos ahora? | "Pagos reales, login" |

📄 La spec de este proyecto está en [`SPEC.md`](./SPEC.md).

**Prompt tipo para el agente:**

```
Leé docs/SPEC.md. Vamos a implementar SOLO el requisito R2.
Antes de escribir código, decime qué criterios de aceptación vas a cubrir
y qué archivos vas a tocar. Esperá mi OK.
```

---

## 2. TDD — Test-Driven Development (primero el test)

**Idea:** el test se escribe **antes** que el código. Primero falla (rojo), después
escribimos lo mínimo para que pase (verde), y al final ordenamos (refactor).

```
🔴 ROJO  →  🟢 VERDE  →  🔵 REFACTOR  →  (repetir)
 test que     código mínimo   mejorar sin
 falla        que lo pasa     romper nada
```

En este proyecto usamos **Vitest** (el corredor de tests de Vite) y
**Testing Library** para probar componentes como si fuéramos el usuario.

```bash
npm test          # corre los tests en modo "watch" (se re-ejecutan al guardar)
npm run test:run  # corre todos una vez y termina
```

**Prompt tipo para el agente:**

```
Modo TDD para el criterio CA-2.1 de docs/SPEC.md:
1) Escribí SOLO el test en src/logic/filtros.test.js y corré npm run test:run
   para mostrarme que falla (rojo).
2) Esperá mi OK.
3) Recién ahí escribí el código mínimo para que pase (verde).
```

---

## 3. Cómo se juntan SDD y TDD

```
SPEC.md                         tests                          código
───────                         ─────                          ──────
R2 Buscador         ──►  "filtra por nombre"        ──►  filtrarProductos()
  CA-2.1 nombre              "ignora mayúsculas"
  CA-2.2 mayúsculas          "texto vacío = todos"
```

- Cada **criterio de aceptación** (CA) se convierte en **uno o más tests**.
- Si un test no se puede rastrear a un CA → o falta en la spec, o sobra.
- Si cambia la spec → primero se cambia el test, después el código.

---

## 4. Reglas de la casa (con el agente)

1. **Una tarea por pedido.** Un requisito o un criterio por vez.
2. **Spec primero.** Si no está en `SPEC.md`, no se programa: primero se agrega.
3. **Test primero.** Rojo → verde → refactor. Nunca código sin su test.
4. **Leé el diff** antes de aceptar. Siempre.
5. **`npm run test:run` en verde** antes de dar algo por terminado.
6. **Secretos al `.env`**, nunca al código. El `.env` no se sube (está en `.gitignore`).
7. **Lógica separada de la vista:** las reglas de negocio (filtrar, sumar el carrito)
   viven en `src/logic/` como funciones puras → fáciles de testear y de mover al backend.

---

## 5. Por qué esto nos sirve para el backend 🚀

La tienda hoy **no tiene backend**: los productos salen de `src/data/productos.js`
a través de un **servicio** (`src/services/productosService.js`).

Como los componentes **nunca** leen los datos directo, sino que le piden al servicio,
pasar a una API real es cambiar **un solo archivo**: el servicio deja de leer el
array y pasa a hacer `fetch(import.meta.env.VITE_API_URL + "/productos")`.

Y los tests nos avisan si algo se rompió en la mudanza. 😉
