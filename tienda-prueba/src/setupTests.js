// Agrega "matchers" extra a los tests, como toBeInTheDocument() o toBeDisabled()
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  // Los tests del backend corren en entorno Node (sin navegador): ahí no hay localStorage
  if (typeof localStorage !== 'undefined') localStorage.clear()
})
