// 🚪 LA PUERTA (URL: /login) — la misma para clientes y admins.
// Al entrar bien: el admin cae al depósito (/admin), el cliente a la tienda (/).
import { Link, useNavigate } from 'react-router-dom'
import Login from '../components/Login.jsx'

export default function PaginaLogin({ onEntrar }) {
  const navegar = useNavigate()

  const entrarYNavegar = async (email, contrasenia) => {
    const sesion = await onEntrar(email, contrasenia) // si falla, el form muestra el error
    // El color de la pulsera decide adónde caés:
    navegar(sesion.usuario.rol === 'admin' ? '/admin' : '/', { replace: true })
  }

  return (
    <>
      <Login onEntrar={entrarYNavegar} />
      <p className="volver">
        <Link to="/">← Volver a la tienda</Link>
      </p>
    </>
  )
}
