import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: true exposes the dev server on the LAN so it can be opened
  // directly from an iPad's Safari for on-device testing.
  server: { host: true },
})
