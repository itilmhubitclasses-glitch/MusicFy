import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { songsApiPlugin } from './plugins/vite-plugin-songs-api.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    songsApiPlugin(),
  ],
})

