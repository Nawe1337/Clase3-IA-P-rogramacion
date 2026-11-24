// 🚪 EL FORM DE LA PUERTA — el mismo para clientes y admins.
// Solo pregunta dos cosas: quién sos (email) y la prueba (contraseña).
// El ROL no se elige acá: te lo da la BD → el admin no puede "hacerse admin".
import { useState } from 'react'

export default function Login({ onEntrar }) {
  const [email, setEmail] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (evento) => {
    evento.preventDefault() // no recargamos la página: somos una app
    setError('')
    setCargando(true)
    try {
      await onEntrar(email, contrasenia)
      // si entró, este componente se desmonta (App muestra <Cuenta/>)
    } catch (err) {
      setError(err.message) // "Email o contraseña incorrectos"
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="login" aria-label="Ingresar">
      <form className="login__form" onSubmit={enviar}>
        <h2 className="login__titulo">Ingresar</h2>
        <p className="login__bajada">La misma puerta para todos. Tu rol decide qué ves.</p>

        <label className="login__campo">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@pisada.test"
            required
          />
        </label>

        <label className="login__campo">
          Contraseña
          <input
            type="password"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            placeholder="admin123"
            required
          />
        </label>

        {error && (
          <p className="login__error" role="alert">
            {error}
          </p>
        )}

        <button className="login__boton" type="submit" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Ingresar'}
        </button>
      </form>
    </section>
  )
}
