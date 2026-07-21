import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Esta línea es la más importante para GitHub Pages
  // Asegura que las rutas de los archivos apunten a tu repositorio
  base: '/mybracketsapp/', 
})