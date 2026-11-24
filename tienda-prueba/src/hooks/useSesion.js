// 🎫 El estado de la sesión: quién está logueado y cómo entrar/salir.
// Igual que useCarrito: el hook guarda el estado, los componentes solo mandan eventos.
import { useCallback, useState } from 'react'
import { login, logout, leerSesion } from '../services/sesionesService.js'

export function useSesion() {
  // Arranca leyendo localStorage → por eso al recargar seguís logueado
  const [sesion, setSesion] = useState(leerSesion)

  const entrar = useCallback(async (email, contrasenia) => {
    const nueva = await login(email, contrasenia) // si falla, avisa el error al form
    setSesion(nueva)
    return nueva
  }, [])

  const salir = useCallback(async () => {
    await logout() // borra la pulsera de la BD y del navegador
    setSesion(null)
  }, [])

  return { sesion, entrar, salir }
}
