import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Solo acepta dominios de túnel dinámicos cuando se habilita expresamente al iniciar Vite.
    allowedHosts: process.env.VITE_ALLOW_TUNNEL === "true" ? true : [],
    proxy: {
      // Spring Boot corre en el puerto 8080; el proxy mantiene las peticiones
      // same-origin en el navegador durante el desarrollo.
      "/contenido": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
      "/docs": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/openapi.json": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
})
