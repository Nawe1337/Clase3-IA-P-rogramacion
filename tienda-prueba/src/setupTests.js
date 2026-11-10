// Agrega "matchers" extra a los tests, como toBeInTheDocument() o toBeDisabled()
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
})
