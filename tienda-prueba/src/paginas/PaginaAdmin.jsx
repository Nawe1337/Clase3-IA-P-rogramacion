// 🛠️ EL DEPÓSITO (URL: /admin) — el panel del admin.
// Esta página SOLO se muestra si el guardia de App.jsx comprobó tu pulsera VIP.
// Todo lo que guardás acá va directo a la base de datos.
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PanelAdmin from '../components/PanelAdmin.jsx'
import { obtenerProductos } from '../services/productosService.js'

export default function PaginaAdmin() {
  const [productos, setProductos] = useState([])
  const [estado, setEstado] = useState('cargando')

  const recargar = useCallback(() => {
    return obtenerProductos()
      .then((lista) => {
        setProductos(lista)
        setEstado('listo')
      })
      .catch(() => setEstado('error'))
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  return (
    <>
      <div className="admin__top">
        <Link className="admin__volver" to="/">
          ← Volver a la tienda
        </Link>
        <span className="admin__url muted">/admin · solo pulseras VIP</span>
      </div>

      {estado === 'cargando' && <p className="estado">Cargando productos…</p>}
      {estado === 'error' && <p className="estado estado--error">No pudimos cargar los productos. ¿Está andando la API?</p>}
      {estado === 'listo' && <PanelAdmin productos={productos} onCambio={recargar} />}
    </>
  )
}
