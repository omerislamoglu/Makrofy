import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    outDir: 'dist',
    // Capacitor needs assets to be relative
    assetsDir: 'assets',
    // Vite 8 uses Rolldown (oxc) by default — esbuild.drop is ignored.
    // Instead pass minify options directly to the Rolldown output.
    rolldownOptions: {
      output: {
        minify: {
          compress: { dropConsole: true, dropDebugger: true },
          mangle: true,
          codegen: true,
        },
      },
    },
  },
})
