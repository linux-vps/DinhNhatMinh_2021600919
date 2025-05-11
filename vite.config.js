import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
    extensions: ['.js', '.jsx', '.json']
  },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  }
})
