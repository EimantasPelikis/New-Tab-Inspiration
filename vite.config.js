import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths: extension pages load from chrome-extension://<id>/.
  base: './',
  server: {
    proxy: {
      // ZenQuotes sends no CORS headers without an API key, so proxy it.
      '/zenquotes': {
        target: 'https://zenquotes.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zenquotes/, '/api'),
      },
    },
  },
})
