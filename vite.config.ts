import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // The GitHub Pages project URL lives below /11-11/. Keep local development at /.
  base: command === 'build' ? '/11-11/' : '/',
  plugins: [react()]
}))
