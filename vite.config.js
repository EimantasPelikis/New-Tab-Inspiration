import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))

// package.json is the single source of truth for the version. public/manifest.json
// is copied to dist/ as-is, so stamp the version into the built copy.
function manifestVersion() {
  let outDir
  return {
    name: 'manifest-version',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const file = resolve(outDir, 'manifest.json')
      const manifest = JSON.parse(readFileSync(file, 'utf8'))
      writeFileSync(file, JSON.stringify({ ...manifest, version }, null, 2) + '\n')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), manifestVersion()],
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
