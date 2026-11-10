/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// loadEnv lee el archivo .env de la raíz del proyecto.
// El tercer parámetro 'VITE_' dice: "traeme solo las variables que empiezan con VITE_".
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 5173, // si no hay .env → 5173
      strictPort: true, // si el puerto está ocupado, avisa en vez de cambiarlo solo
    },
    test: {
      environment: 'jsdom', // simula un navegador para los tests
      globals: true,
      setupFiles: './src/setupTests.js',
    },
  }
})
