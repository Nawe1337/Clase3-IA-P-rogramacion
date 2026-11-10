const GENEROS = [
  ['todos', 'Todos'],
  ['hombre', 'Hombre'],
  ['mujer', 'Mujer'],
]
const DEPORTES = [
  ['todos', 'Todos'],
  ['running', 'Running'],
  ['training', 'Training'],
  ['urbana', 'Urbana'],
  ['basquet', 'Básquet'],
  ['trail', 'Trail'],
]

function Chips({ titulo, opciones, valor, onCambiar }) {
  return (
    <div className="chips" role="group" aria-label={titulo}>
      <span className="chips__titulo">{titulo}</span>
      {opciones.map(([id, etiqueta]) => (
        <button key={id} className="chip" aria-pressed={valor === id} onClick={() => onCambiar(id)}>
          {etiqueta}
        </button>
      ))}
    </div>
  )
}

export default function Filtros({ filtros, onCambiar, orden, onOrden, resultados }) {
  return (
    <section className="filtros" aria-label="Filtros">
      <div className="filtros__fila">
        <input
          className="buscador"
          type="search"
          placeholder="Buscá por modelo o marca…"
          aria-label="Buscar zapatillas"
          value={filtros.texto}
          onChange={(e) => onCambiar({ ...filtros, texto: e.target.value })}
        />
        <label className="orden">
          Ordenar
          <select aria-label="Ordenar por" value={orden} onChange={(e) => onOrden(e.target.value)}>
            <option value="relevancia">Más relevantes</option>
            <option value="menor-precio">Menor precio</option>
            <option value="mayor-precio">Mayor precio</option>
            <option value="descuento">Mejor descuento</option>
          </select>
        </label>
      </div>
      <Chips titulo="Género" opciones={GENEROS} valor={filtros.genero} onCambiar={(genero) => onCambiar({ ...filtros, genero })} />
      <Chips titulo="Deporte" opciones={DEPORTES} valor={filtros.deporte} onCambiar={(deporte) => onCambiar({ ...filtros, deporte })} />
      <p className="filtros__resultados">{resultados} resultados</p>
    </section>
  )
}
